import { Link } from 'react-router-dom';
import { useUpcomingEvents } from '../api/events';
import { defaultSiteContent, useSettings } from '../api/content';

export default function Home() {
  const { data: events, isLoading } = useUpcomingEvents();
  const { data: settings } = useSettings();
  const content = { ...defaultSiteContent.home, ...settings?.home };
  const featured = events?.find((e) => e.isFeatured) || events?.[0];

  return (
    <div>
      <section className="flex flex-col sm:flex-row items-center gap-8 lg:gap-11 px-4 sm:px-6 lg:px-10 py-10 sm:py-14 bg-ivory/70">
        <div className="flex-1">
          <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
            {content.eyebrow}
          </span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl leading-tight text-indigo mb-4 whitespace-pre-line">
            {content.title}
          </h1>
          <p className="text-sm text-indigo/70 leading-relaxed max-w-md mb-6">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/about" className="bg-vermilion text-ivory px-5 py-2.5 rounded text-[13px] font-semibold">
              {content.primaryCta}
            </Link>
            <Link to="/contact" className="border border-indigo text-indigo px-5 py-2.5 rounded text-[13px] font-semibold">
              {content.secondaryCta}
            </Link>
          </div>
        </div>
        <div className="w-full max-w-xs h-52 sm:h-72 rounded-t-full bg-gradient-to-br from-indigo to-indigo-deep flex-shrink-0" />
      </section>

      {featured && (
        <div className="bg-vermilion text-ivory px-4 sm:px-6 lg:px-10 py-2.5 text-[12.5px] flex gap-2.5 items-center">
          <span className="bg-marigold text-indigo text-[9.5px] font-bold px-2 py-0.5 rounded-full">
            {featured.category?.toUpperCase()}
          </span>
          {featured.title}
        </div>
      )}

      <section className="px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
        <h2 className="font-display font-semibold text-2xl text-indigo mb-6">Upcoming Events</h2>
        {isLoading ? (
          <p className="text-sm text-indigo/60">Loading events…</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {events?.slice(0, 3).map((event) => (
              <Link
                key={event._id}
                to={`/events/${event.slug}`}
                className="bg-white border border-indigo/10 rounded-lg p-5 block hover:shadow-md transition"
              >
                <div className="text-[10.5px] text-vermilion font-semibold">
                  {new Date(event.startDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  &middot; {event.category?.toUpperCase()}
                </div>
                <div className="font-display font-semibold text-indigo mt-1.5">{event.title}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
