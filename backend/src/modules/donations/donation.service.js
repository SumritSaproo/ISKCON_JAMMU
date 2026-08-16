const crypto = require('crypto');
const { getRazorpay } = require('../../config/razorpay');
const Donation = require('./donation.model');
const { AppError } = require('../../middlewares/errorHandler');
const { sendMail } = require('../../utils/email');
const { buildDonationReceiptPdf } = require('../../utils/receipt');

/**
 * Step 1: create a Razorpay order and a local "created" donation record.
 * The client uses the returned order to open Razorpay Checkout.
 */
async function initiateDonation({ donorName, email, phone, amount, category, panNumber }) {
  let order;
  try {
    order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: 'INR',
      receipt: `don_${Date.now()}`,
    });
  } catch (err) {
    // Covers both "not configured" (thrown by getRazorpay) and real
    // Razorpay API errors, without ever crashing the process.
    throw new AppError(err.message || 'Unable to start payment. Please try again shortly.', 502);
  }

  const donation = await Donation.create({
    donorName,
    email,
    phone,
    amount,
    category,
    panNumber,
    razorpayOrderId: order.id,
    status: 'created',
  });

  return { orderId: order.id, amount: order.amount, currency: order.currency, donationId: donation._id };
}

/**
 * Step 2: verify the payment signature Razorpay returns after checkout.
 * NEVER trust the client-reported amount/status — signature verification
 * against RAZORPAY_KEY_SECRET is the only source of truth.
 */
async function verifyAndCompleteDonation({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    await Donation.findOneAndUpdate({ razorpayOrderId }, { status: 'failed' });
    throw new AppError('Payment verification failed', 400);
  }

  const donation = await Donation.findOneAndUpdate(
    { razorpayOrderId },
    { razorpayPaymentId, razorpaySignature, status: 'paid' },
    { new: true }
  );
  if (!donation) throw new AppError('Donation record not found', 404);

  // Fire-and-forget: the payment is already confirmed at this point, so a
  // slow or failed email must never fail the response back to the browser.
  sendReceiptEmail(donation).catch((err) =>
    console.error(`Failed to send receipt for donation ${donation._id}:`, err.message)
  );

  return donation;
}

async function sendReceiptEmail(donation) {
  const pdfBuffer = await buildDonationReceiptPdf(donation);
  await sendMail({
    to: donation.email,
    subject: 'Your ISKCON Jammu Donation Receipt',
    html: `
      <p>Hare Krishna ${donation.donorName},</p>
      <p>Thank you for your donation of <strong>₹${Number(donation.amount).toLocaleString('en-IN')}</strong>
      towards <strong>${(donation.category || '').replace('_', ' ')}</strong>. Your receipt is attached.</p>
      <p>Hare Krishna Hare Krishna, Krishna Krishna Hare Hare<br/>
      Hare Rama Hare Rama, Rama Rama Hare Hare</p>
      <p>— ISKCON Jammu, Dream City, Muthi</p>
    `,
    attachments: [
      { filename: `receipt-${donation._id}.pdf`, content: pdfBuffer, contentType: 'application/pdf' },
    ],
  });
  await Donation.findByIdAndUpdate(donation._id, { receiptSent: true });
}

module.exports = { initiateDonation, verifyAndCompleteDonation };
