import { useState } from 'react';
import { useSubmitContact } from '../api/forms';

export default function Contact() {
  const submitContact = useSubmitContact();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  return (
    <div className="flex flex-wrap">
      <div className="flex-1 min-w-[280px] px-4 sm:px-6 lg:px-10 py-10 sm:py-11">
        <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
          We'd Love to See You
        </span>
        <h1 className="font-display font-semibold text-2xl text-indigo mb-1">Visit or Reach Out</h1>
        <div className="h-[3px] w-14 bg-marigold rounded mb-5" />

        <div className="text-[13px] text-indigo/70 leading-loose mb-6">
          ISKCON Jammu
          <br />
          Dream City, Muthi, Jammu, J&amp;K
          <br />
          📞 +91 XXXXX XXXXX &nbsp;&middot;&nbsp; ✉️ info@iskconjammu.org
        </div>

        {submitContact.isSuccess ? (
          <p className="text-sm text-teal">
            Thank you — your message has been received. We'll get back to you soon. 🙏
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitContact.mutate(form);
            }}
          >
            <input
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white border border-indigo/15 rounded px-3 py-2.5 text-xs mb-2.5"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white border border-indigo/15 rounded px-3 py-2.5 text-xs mb-2.5"
            />
            <textarea
              required
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white border border-indigo/15 rounded px-3 py-2.5 text-xs mb-3"
            />
            {submitContact.isError && (
              <p className="text-[11px] text-vermilion mb-2">
                {submitContact.error?.response?.data?.message || 'Could not send. Please try again.'}
              </p>
            )}
            <button
              disabled={submitContact.isPending}
              className="bg-vermilion text-ivory px-5 py-2.5 rounded text-[13px] font-semibold disabled:opacity-60"
            >
              {submitContact.isPending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>

      <div className="flex-1 min-w-[280px] min-h-[340px] bg-gradient-to-br from-indigo to-indigo-deep flex items-center justify-center">
        <span className="text-[13px] bg-white/90 text-indigo px-4 py-2 rounded-full font-semibold">
          📍 Dream City, Muthi, Jammu
        </span>
      </div>
    </div>
  );
}
