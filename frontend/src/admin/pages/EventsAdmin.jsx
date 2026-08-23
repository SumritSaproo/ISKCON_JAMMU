import { useState } from 'react';
import { useAdminUpcomingEvents } from '../../api/events';
import { useCreateEvent, useDeleteEvent } from '../../api/admin';

const CATEGORIES = ['festival', 'satsang', 'seva', 'workshop', 'other'];

function getMinimumEventDate() {
  const minimumDate = new Date(Date.now() + 60 * 1000);
  const timezoneOffset = minimumDate.getTimezoneOffset();
  const localDate = new Date(minimumDate.getTime() - timezoneOffset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export default function EventsAdmin() {
  const { data: events, isLoading, isError: isEventsError, error: eventsError } = useAdminUpcomingEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    category: 'festival',
    rsvpEnabled: false,
    coverImage: null,
  });

  function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.title.trim().length < 3) {
      setError('Please enter an event title with at least 3 characters.');
      return;
    }
    if (form.description.trim().length < 10) {
      setError('Please enter a description with at least 10 characters.');
      return;
    }
    if (!form.startDate) {
      setError('Please choose the event date and time.');
      return;
    }
    if (new Date(form.startDate) < new Date()) {
      setError('Event date and time must be in the future.');
      return;
    }
    if (form.coverImage && form.coverImage.size > 8 * 1024 * 1024) {
      setError('The cover photo is too large. Please choose an image under 8 MB.');
      return;
    }
    const isoStartDate = form.startDate ? new Date(form.startDate).toISOString() : undefined;
    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('description', form.description);
    payload.append('startDate', isoStartDate);
    payload.append('category', form.category);
    payload.append('rsvpEnabled', String(form.rsvpEnabled));
    if (form.coverImage) {
      payload.append('coverImage', form.coverImage);
    }

    createEvent.mutate(payload, {
      onSuccess: () => {
        setForm({ title: '', description: '', startDate: '', category: 'festival', rsvpEnabled: false, coverImage: null });
        setShowForm(false);
        setSuccess('Event created successfully.');
      },
      onError: (err) => {
        setError(
          err?.response?.data?.message ||
            (err?.response?.status === 401
              ? 'Your session has expired. Please sign in again.'
              : err?.response?.status === 403
                ? 'You do not have permission to create events.'
                : 'Could not create event. Please check your connection and try again.')
        );
      },
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-display font-semibold text-lg text-indigo">Events</div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setError('');
            setSuccess('');
          }}
          className="bg-vermilion text-ivory text-xs font-semibold px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {success && (
        <p role="status" className="mb-4 rounded border border-teal/20 bg-teal/10 px-3 py-2 text-xs text-teal">
          {success}
        </p>
      )}

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
          <label className="block text-xs text-indigo/70 mb-3">
            <span className="font-semibold text-indigo">Cover photo</span>
            <span className="block text-[11px] text-indigo/50 mt-1 mb-2">
              Recommended: 1200 × 675 px (16:9) for sharp event cards. JPG, PNG, or WEBP, max 8 MB.
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file && file.size > 8 * 1024 * 1024) {
                  setError('The cover photo is too large. Please choose an image under 8 MB.');
                  return;
                }
                setError('');
                setForm({ ...form, coverImage: file });
              }}
              className="block text-xs"
            />
          </label>
          <div className="flex gap-2.5 mb-2.5">
            <input
              required
              type="datetime-local"
              min={getMinimumEventDate()}
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
          {error && (
            <p role="alert" className="mb-2 rounded border border-vermilion/20 bg-vermilion/5 px-3 py-2 text-[11px] text-vermilion">
              {error}
            </p>
          )}
          <button
            disabled={createEvent.isPending}
            className="bg-indigo text-ivory text-xs font-semibold px-4 py-2 rounded disabled:opacity-60"
          >
            {createEvent.isPending ? 'Creating…' : 'Create Event'}
          </button>
        </form>
      )}

      <div className="bg-white border border-indigo/10 rounded-lg overflow-hidden">
        {isEventsError ? (
          <div role="alert" className="p-4 text-xs text-vermilion">
            {eventsError?.response?.data?.message || 'Could not load events. Please sign in again and retry.'}
          </div>
        ) : isLoading ? (
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
                  {ev.rsvpEnabled && ` · ${ev.rsvpCount || 0} RSVPs`}
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
