const Razorpay = require('razorpay');

// The Razorpay SDK throws synchronously at construction time if key_id is
// missing — which would crash the entire server on boot, not just the
// donation feature. Lazily construct it instead, so the app starts fine
// without Razorpay configured, and only donation requests fail (clearly)
// until real keys are added.
let razorpay = null;

function getRazorpay() {
  if (razorpay) return razorpay;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      'Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env before accepting donations.'
    );
  }

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return razorpay;
}

module.exports = { getRazorpay };
