import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUpcomingEvents, useEvent } from '../api/events';
import { useRsvpEvent } from '../api/forms';

const CATEGORIES = ['all', 'festival', 'satsang', 'seva', 'workshop', 'other'];

function RsvpForm({ eventId }) {
  const rsvp = useRsvpEvent();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  if (rsvp.isSuccess) {
    return <p className="text-xs text-teal mt-3">You're on the list! We'll see you there. 🙏</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        rsvp.mutate({ eventId, ...form });
      }}
      className="mt-3 flex flex-wrap gap-2"
    >
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-indigo/15 rounded px-2.5 py-1.5 text-xs flex-1 min-w-[100px]"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border border-indigo/15 rounded px-2.5 py-1.5 text-xs flex-1 min-w-[120px]"
      />
      <input
        required
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="border border-indigo/15 rounded px-2.5 py-1.5 text-xs flex-1 min-w-[100px]"
      />
      <button
        disabled={rsvp.isPending}
        className="bg-vermilion text-ivory text-xs font-semibold px-4 py-1.5 rounded disabled:opacity-60"
      >
        {rsvp.isPending ? 'Sending…' : 'RSVP'}
      </button>
      {rsvp.isError && (
        <p className="text-[11px] text-vermilion w-full">
          {rsvp.error?.response?.data?.message || 'Could not RSVP. Please try again.'}
        </p>
      )}
    </form>
  );
}

export default function Events() {
  const { slug } = useParams();
  const [category, setCategory] = useState('all');
  const { data: events, isLoading } = useUpcomingEvents(category === 'all' ? undefined : category);
  const { data: singleEvent } = useEvent(slug);

  if (slug && singleEvent) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14 max-w-2xl">
        <div className="text-[10.5px] text-vermilion font-semibold">
          {new Date(singleEvent.startDate).toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}{' '}
          &middot; {singleEvent.category?.toUpperCase()}
        </div>
        <h1 className="font-display font-semibold text-2xl text-indigo mt-2 mb-4">
          {singleEvent.title}
        </h1>
        {singleEvent.coverImage && (
          <div className="w-full aspect-video max-h-96 rounded-lg overflow-hidden mb-5 bg-indigo-deep">
            <img
              src={singleEvent.coverImage}
              alt={singleEvent.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <p className="text-sm text-indigo/70 leading-relaxed">{singleEvent.description}</p>
        {singleEvent.rsvpEnabled && (
          <div className="mt-6 bg-ivory-dim rounded-lg p-5">
            <div className="font-display font-semibold text-sm text-indigo mb-1">RSVP</div>
            <RsvpForm eventId={singleEvent._id} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
      <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
        What's On
      </span>
      <h1 className="font-display font-semibold text-2xl text-indigo mb-1">Events &amp; Festivals</h1>
      <div className="h-[3px] w-14 bg-marigold rounded mb-5" />

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs px-3.5 py-1.5 rounded-full border ${
              category === c ? 'bg-indigo text-ivory border-indigo' : 'border-indigo/15 text-indigo'
            }`}
          >
            {c[0].toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-indigo/60">Loading events…</p>
      ) : !events?.length ? (
        <p className="text-sm text-indigo/60">No upcoming events in this category yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event.slug}`}
              className="bg-white border border-indigo/10 rounded-lg overflow-hidden block hover:shadow-md transition"
            >
              <div className="aspect-video w-full bg-gradient-to-br from-indigo to-indigo-deep">
                {event.coverImage && (
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="text-[10px] text-vermilion font-semibold">
                  {new Date(event.startDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  &middot; {event.category?.toUpperCase()}
                </div>
                <div className="font-display font-semibold text-sm text-indigo mt-1.5">
                  {event.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
