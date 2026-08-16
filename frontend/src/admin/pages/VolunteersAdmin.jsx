import { useState } from 'react';
import { useAdminVolunteers, useUpdateVolunteerStatus } from '../../api/admin';

const STATUSES = ['new', 'contacted', 'active', 'inactive'];

export default function VolunteersAdmin() {
  const [status, setStatus] = useState('');
  const { data: volunteers, isLoading } = useAdminVolunteers(status ? { status } : {});
  const updateStatus = useUpdateVolunteerStatus();

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-display font-semibold text-lg text-indigo">Volunteers</div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatus('')}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              !status ? 'bg-indigo text-ivory border-indigo' : 'border-indigo/15 text-indigo'
            }`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize ${
                status === s ? 'bg-indigo text-ivory border-indigo' : 'border-indigo/15 text-indigo'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-indigo/10 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-xs text-indigo/50">Loading…</div>
        ) : !volunteers?.length ? (
          <div className="p-4 text-xs text-indigo/50">No volunteer registrations yet.</div>
        ) : (
          volunteers.map((v) => (
            <div
              key={v._id}
              className="flex justify-between items-center px-4.5 py-3 border-b border-indigo/10 last:border-0 text-xs"
            >
              <div>
                <div className="font-semibold text-indigo">{v.name}</div>
                <div className="text-indigo/50">
                  {v.email} &middot; {v.phone} &middot;{' '}
                  <span className="capitalize">{v.interestArea?.replace('_', ' ')}</span>
                  {v.availability && <> &middot; {v.availability}</>}
                </div>
                {v.message && <div className="text-indigo/40 mt-1 italic">"{v.message}"</div>}
              </div>
              <select
                value={v.status}
                onChange={(e) => updateStatus.mutate({ id: v._id, status: e.target.value })}
                className="border border-indigo/15 rounded px-2 py-1 text-[11px] capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
