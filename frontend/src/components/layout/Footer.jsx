import { useState } from 'react';
import { useSubscribeNewsletter } from '../../api/forms';
import { defaultSiteContent, useSettings } from '../../api/content';

export default function Footer() {
  const subscribe = useSubscribeNewsletter();
  const { data: settings } = useSettings();
  const content = { ...defaultSiteContent.footer, ...settings?.footer };
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-indigo text-ivory px-4 sm:px-6 lg:px-10 py-10 mt-16">
      <div className="grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-display font-semibold text-marigold-soft mb-2">{content.brand}</div>
          <p className="text-ivory/70 text-xs leading-relaxed">
            {content.description}
          </p>
        </div>
        <div>
          <div className="font-semibold text-xs uppercase tracking-wider text-marigold-soft mb-2">
            {content.contactHeading}
          </div>
          <p className="text-ivory/70 text-xs leading-relaxed">
            {content.contactText.split('\n').map((line) => <span key={line}>{line}<br /></span>)}
          </p>
        </div>
        <div>
          <div className="font-semibold text-xs uppercase tracking-wider text-marigold-soft mb-2">
            {content.timingsHeading}
          </div>
          <p className="text-ivory/70 text-xs leading-relaxed">
            {content.timingsText.split('\n').map((line) => <span key={line}>{line}<br /></span>)}
          </p>
        </div>
        <div>
          <div className="font-semibold text-xs uppercase tracking-wider text-marigold-soft mb-2">
            {content.newsletterHeading}
          </div>
          {subscribe.isSuccess ? (
            <p className="text-ivory/70 text-xs">{content.newsletterSuccess}</p>
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
                placeholder={content.newsletterPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 bg-ivory/10 border border-ivory/20 rounded px-2.5 py-1.5 text-[11px] text-ivory placeholder:text-ivory/40"
              />
              <button
                disabled={subscribe.isPending}
                className="bg-marigold text-indigo text-[11px] font-semibold px-3 rounded disabled:opacity-60"
              >
                {content.newsletterButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}
