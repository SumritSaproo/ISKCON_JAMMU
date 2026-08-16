import { useState } from 'react';
import { useUpcomingEvents } from '../../api/events';
import { useCreateEvent, useDeleteEvent } from '../../api/admin';

const CATEGORIES = ['festival', 'satsang', 'seva', 'workshop', 'other'];

export default function EventsAdmin() {
  const { data: events, isLoading } = useUpcomingEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    category: 'festival',
    rsvpEnabled: false,
  });

  function handleCreate(e) {
    e.preventDefault();
    createEvent.mutate(form, {
      onSuccess: () => {
        setForm({ title: '', description: '', startDate: '', category: 'festival', rsvpEnabled: false });
        setShowForm(false);
      },
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-display font-semibold text-lg text-indigo">Events</div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-vermilion text-ivory text-xs font-semibold px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-indigo/10 rounded-lg p-5 mb-6">
          <input
            required
            placeholder="Event title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-indigo/15 rounded px-3 py-2 text-xs mb-2.5"
          />
          <textarea
            required
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-indigo/15 rounded px-3 py-2 text-xs mb-2.5"
          />
          <div className="flex gap-2.5 mb-2.5">
            <input
              required
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="flex-1 border border-indigo/15 rounded px-3 py-2 text-xs"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-indigo/15 rounded px-3 py-2 text-xs"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs text-indigo/70 mb-3">
            <input
              type="checkbox"
              checked={form.rsvpEnabled}
              onChange={(e) => setForm({ ...form, rsvpEnabled: e.target.checked })}
            />
            Enable RSVP for this event
          </label>
          <button
            disabled={createEvent.isPending}
            className="bg-indigo text-ivory text-xs font-semibold px-4 py-2 rounded disabled:opacity-60"
          >
            {createEvent.isPending ? 'Creating…' : 'Create Event'}
          </button>
        </form>
      )}

      <div className="bg-white border border-indigo/10 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-xs text-indigo/50">Loading…</div>
        ) : !events?.length ? (
          <div className="p-4 text-xs text-indigo/50">No events yet.</div>
        ) : (
          events.map((ev) => (
            <div
              key={ev._id}
              className="flex justify-between items-center px-4.5 py-3 border-b border-indigo/10 last:border-0 text-xs"
            >
              <div>
                <div className="font-semibold text-indigo">{ev.title}</div>
                <div className="text-indigo/50">
                  {new Date(ev.startDate).toLocaleDateString('en-IN')} &middot; {ev.category}
                </div>
              </div>
              <button
                onClick={() => confirm(`Delete "${ev.title}"?`) && deleteEvent.mutate(ev._id)}
                className="text-vermilion text-[11px]"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
