import { Link } from 'react-router-dom';
import { useUpcomingEvents } from '../api/events';

export default function Home() {
  const { data: events, isLoading } = useUpcomingEvents();
  const featured = events?.find((e) => e.isFeatured) || events?.[0];

  return (
    <div>
      <section className="flex items-center gap-11 px-10 py-14 bg-gradient-to-b from-ivory to-ivory-dim">
        <div className="flex-1">
          <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
            Hare Krishna &middot; Welcome
          </span>
          <h1 className="font-display font-semibold text-4xl leading-tight text-indigo mb-4">
            A home for Krishna
            <br />
            consciousness in Jammu
          </h1>
          <p className="text-sm text-indigo/70 leading-relaxed max-w-md mb-6">
            Join us for daily darshan, kirtan and prasadam at ISKCON Jammu — nestled in Dream
            City, Muthi. All are welcome, every day of the year.
          </p>
          <div className="flex gap-3">
            <Link to="/about" className="bg-vermilion text-ivory px-5 py-2.5 rounded text-[13px] font-semibold">
              Today's Darshan Timings
            </Link>
            <Link to="/contact" className="border border-indigo text-indigo px-5 py-2.5 rounded text-[13px] font-semibold">
              Plan a Visit
            </Link>
          </div>
        </div>
        <div className="w-80 h-72 rounded-t-full bg-gradient-to-br from-indigo to-indigo-deep flex-shrink-0" />
      </section>

      {featured && (
        <div className="bg-vermilion text-ivory px-10 py-2.5 text-[12.5px] flex gap-2.5 items-center">
          <span className="bg-marigold text-indigo text-[9.5px] font-bold px-2 py-0.5 rounded-full">
            {featured.category?.toUpperCase()}
          </span>
          {featured.title}
        </div>
      )}

      <section className="px-10 py-12">
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
