import { useState } from 'react';
import { useRegisterVolunteer } from '../api/forms';

const AREAS = [
  ['kitchen_seva', 'Kitchen Seva'],
  ['event_management', 'Event Management'],
  ['teaching', 'Teaching'],
  ['deity_seva', 'Deity Seva'],
  ['outreach', 'Outreach'],
  ['other', 'Other'],
];

export default function Volunteer() {
  const registerVolunteer = useRegisterVolunteer();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interestArea: 'kitchen_seva',
    availability: '',
    message: '',
  });

  if (registerVolunteer.isSuccess) {
    return (
      <div className="px-4 sm:px-6 lg:px-10 py-16 max-w-md mx-auto text-center">
        <div className="text-4xl mb-3">🙏</div>
        <h1 className="font-display font-semibold text-2xl text-indigo mb-2">Thank You!</h1>
        <p className="text-sm text-indigo/70">
          We've received your volunteer registration and will reach out soon.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14 max-w-xl">
      <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
        Join Bhakti Vriksha
      </span>
      <h1 className="font-display font-semibold text-2xl text-indigo mb-1">Volunteer With Us</h1>
      <div className="h-[3px] w-14 bg-marigold rounded mb-5" />
      <p className="text-xs text-indigo/60 mb-6">
        Whether it's seva in the kitchen, helping run a festival, or teaching — there's a place
        for you at ISKCON Jammu.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          registerVolunteer.mutate(form);
        }}
        className="bg-ivory-dim rounded-lg p-6"
      >
        <input
          required
          placeholder="Full Name"
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
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full bg-white border border-indigo/15 rounded px-3 py-2.5 text-xs mb-2.5"
        />
        <select
          value={form.interestArea}
          onChange={(e) => setForm({ ...form, interestArea: e.target.value })}
          className="w-full bg-white border border-indigo/15 rounded px-3 py-2.5 text-xs mb-2.5"
        >
          {AREAS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          placeholder="Availability (e.g. weekends, evenings)"
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
          className="w-full bg-white border border-indigo/15 rounded px-3 py-2.5 text-xs mb-2.5"
        />
        <textarea
          placeholder="Anything else you'd like us to know?"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-white border border-indigo/15 rounded px-3 py-2.5 text-xs mb-3"
        />

        {registerVolunteer.isError && (
          <p className="text-[11px] text-vermilion mb-2">
            {registerVolunteer.error?.response?.data?.message || 'Could not submit. Please try again.'}
          </p>
        )}

        <button
          disabled={registerVolunteer.isPending}
          className="bg-vermilion text-ivory px-5 py-2.5 rounded text-[13px] font-semibold disabled:opacity-60"
        >
          {registerVolunteer.isPending ? 'Submitting…' : 'Register to Volunteer'}
        </button>
      </form>
    </div>
  );
}
