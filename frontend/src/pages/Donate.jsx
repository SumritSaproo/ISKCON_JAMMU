import { useState } from 'react';
import { initiateDonation, verifyDonation } from '../api/donations';

const AMOUNTS = [501, 1101, 2100];
const CATEGORIES = [
  { value: 'annadaan', label: 'Annadaan', blurb: 'Sponsor a prasadam meal' },
  { value: 'deity_seva', label: 'Deity Seva', blurb: 'Flowers & ornamentation' },
  { value: 'construction_fund', label: 'Construction Fund', blurb: 'Temple expansion project' },
];

function loadRazorpayReady() {
  // The SDK script is loaded globally in index.html; this just confirms it landed.
  return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined';
}

export default function Donate() {
  const [category, setCategory] = useState('deity_seva');
  const [amount, setAmount] = useState(1101);
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ donorName: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  async function handlePay(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!loadRazorpayReady()) {
      setErrorMsg(
        'Payment SDK failed to load — check your internet connection or an ad-blocker isn\'t blocking checkout.razorpay.com.'
      );
      return;
    }
    if (!form.donorName || !form.email || !form.phone || !effectiveAmount) {
      setErrorMsg('Please fill in your name, email, phone, and an amount.');
      return;
    }

    setStatus('processing');
    try {
      // 1. Ask our backend to create a Razorpay order (server holds the secret key)
      const order = await initiateDonation({
        donorName: form.donorName,
        email: form.email,
        phone: form.phone,
        amount: effectiveAmount,
        category,
      });

      // 2. Open Razorpay's hosted checkout using the PUBLIC key_id only
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ISKCON Jammu',
        description: `Donation — ${category.replace('_', ' ')}`,
        order_id: order.orderId,
        prefill: {
          name: form.donorName,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#8C2F39' },
        handler: async (response) => {
          // 3. Verify the payment signature server-side before trusting it
          try {
            await verifyDonation({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setStatus('success');
          } catch (err) {
            setStatus('error');
            setErrorMsg('Payment succeeded but verification failed. Please contact the temple office with your payment ID.');
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });

      rzp.on('payment.failed', () => {
        setStatus('error');
        setErrorMsg('Payment failed or was cancelled. No amount was charged.');
      });

      rzp.open();
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err?.response?.data?.message || 'Could not start the payment. Please try again in a moment.'
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="px-10 py-16 max-w-md mx-auto text-center">
        <div className="text-4xl mb-3">🙏</div>
        <h1 className="font-display font-semibold text-2xl text-indigo mb-2">Hare Krishna!</h1>
        <p className="text-sm text-indigo/70">
          Your donation was received. A receipt has been sent to {form.email}.
        </p>
      </div>
    );
  }

  return (
    <div className="px-10 py-14">
      <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
        Give With Devotion
      </span>
      <h1 className="font-display font-semibold text-2xl text-indigo mb-1">Donation &amp; Seva</h1>
      <p className="text-xs text-indigo/60 max-w-md mb-8">
        Every contribution supports temple worship, prasadam distribution and community
        outreach. Receipts are emailed instantly.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-2xl">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`text-left border rounded-lg p-4 transition ${
              category === c.value ? 'border-marigold border-2' : 'border-indigo/10'
            }`}
          >
            <div className="font-display font-semibold text-sm text-indigo">{c.label}</div>
            <div className="text-[11px] text-indigo/60 mt-1">{c.blurb}</div>
          </button>
        ))}
      </div>

      <form onSubmit={handlePay} className="bg-ivory-dim rounded-lg p-6 max-w-sm">
        <div className="font-display font-semibold text-sm text-indigo mb-3">Quick Donate</div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {AMOUNTS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => {
                setAmount(a);
                setCustomAmount('');
              }}
              className={`px-3.5 py-2 rounded text-xs ${
                amount === a && !customAmount ? 'bg-indigo text-ivory' : 'bg-white border border-indigo/10'
              }`}
            >
              ₹{a.toLocaleString('en-IN')}
            </button>
          ))}
          <input
            type="number"
            min="1"
            placeholder="Other ₹"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="px-3 py-2 rounded text-xs bg-white border border-indigo/10 w-24"
          />
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={form.donorName}
          onChange={(e) => setForm({ ...form, donorName: e.target.value })}
          required
          className="w-full bg-white border border-indigo/10 rounded px-3 py-2.5 text-xs mb-2.5"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full bg-white border border-indigo/10 rounded px-3 py-2.5 text-xs mb-2.5"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
          className="w-full bg-white border border-indigo/10 rounded px-3 py-2.5 text-xs mb-4"
        />

        {errorMsg && <div className="text-[11px] text-vermilion mb-3">{errorMsg}</div>}

        <button
          type="submit"
          disabled={status === 'processing'}
          className="w-full bg-vermilion text-ivory py-3 rounded text-xs font-semibold disabled:opacity-60"
        >
          {status === 'processing' ? 'Opening payment…' : `Proceed to Pay — ₹${effectiveAmount || 0}`}
        </button>
      </form>
    </div>
  );
}
