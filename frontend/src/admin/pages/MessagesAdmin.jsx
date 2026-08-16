import { useState } from 'react';
import { useAdminMessages, useUpdateMessageStatus } from '../../api/admin';

const STATUSES = ['new', 'read', 'replied'];

export default function MessagesAdmin() {
  const [status, setStatus] = useState('');
  const { data: messages, isLoading } = useAdminMessages(status ? { status } : {});
  const updateStatus = useUpdateMessageStatus();

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-display font-semibold text-lg text-indigo">Contact Messages</div>
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
        ) : !messages?.length ? (
          <div className="p-4 text-xs text-indigo/50">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div key={m._id} className="px-4.5 py-3 border-b border-indigo/10 last:border-0 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-indigo">
                    {m.name} <span className="text-indigo/40 font-normal">({m.email})</span>
                  </div>
                  <div className="text-indigo/60 mt-1">{m.message}</div>
                  <div className="text-indigo/40 mt-1">
                    {new Date(m.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <select
                  value={m.status}
                  onChange={(e) => updateStatus.mutate({ id: m._id, status: e.target.value })}
                  className="border border-indigo/15 rounded px-2 py-1 text-[11px] capitalize flex-shrink-0 ml-3"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
