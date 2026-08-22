import { useState } from 'react';
import { useSubscribeNewsletter } from '../../api/forms';

export default function Footer() {
  const subscribe = useSubscribeNewsletter();
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-indigo text-ivory px-4 sm:px-6 lg:px-10 py-10 mt-16">
      <div className="grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-display font-semibold text-marigold-soft mb-2">ISKCON Jammu</div>
          <p className="text-ivory/70 text-xs leading-relaxed">
            Dream City, Muthi, Jammu, J&amp;K — a home for Krishna consciousness in the region.
          </p>
        </div>
        <div>
          <div className="font-semibold text-xs uppercase tracking-wider text-marigold-soft mb-2">
            Contact
          </div>
          <p className="text-ivory/70 text-xs leading-relaxed">
            info@iskconjammu.org
            <br />
            +91 XXXXX XXXXX
          </p>
        </div>
        <div>
          <div className="font-semibold text-xs uppercase tracking-wider text-marigold-soft mb-2">
            Daily Timings
          </div>
          <p className="text-ivory/70 text-xs leading-relaxed">
            Mangala Aarti — 4:30 AM
            <br />
            Sandhya Aarti — 7:00 PM
          </p>
        </div>
        <div>
          <div className="font-semibold text-xs uppercase tracking-wider text-marigold-soft mb-2">
            Newsletter
          </div>
          {subscribe.isSuccess ? (
            <p className="text-ivory/70 text-xs">Subscribed — thank you! 🙏</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                subscribe.mutate(email);
              }}
              className="flex gap-1.5"
            >
              <input
                required
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 bg-ivory/10 border border-ivory/20 rounded px-2.5 py-1.5 text-[11px] text-ivory placeholder:text-ivory/40"
              />
              <button
                disabled={subscribe.isPending}
                className="bg-marigold text-indigo text-[11px] font-semibold px-3 rounded disabled:opacity-60"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}
