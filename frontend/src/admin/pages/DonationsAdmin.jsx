import { useState } from 'react';
import { useAdminDonations } from '../../api/admin';

export default function DonationsAdmin() {
  const [status, setStatus] = useState('paid');
  const { data: donations, isLoading } = useAdminDonations({ status, limit: 100 });

  const total = (donations || []).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div className="font-display font-semibold text-lg text-indigo">Donations</div>
        <div className="flex gap-2">
          {['paid', 'created', 'failed'].map((s) => (
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

      {status === 'paid' && (
        <div className="bg-white border border-indigo/10 rounded-lg p-4 mb-5 inline-block">
          <div className="text-[10.5px] text-indigo/60">Total (shown below)</div>
          <div className="font-display font-semibold text-xl text-indigo">
            ₹{total.toLocaleString('en-IN')}
          </div>
        </div>
      )}

      <div className="bg-white border border-indigo/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 px-4.5 py-2.5 text-[10.5px] text-indigo/50 uppercase tracking-wide">
          <div>Donor</div>
          <div>Category</div>
          <div>Amount</div>
          <div>Payment ID</div>
          <div>Date</div>
        </div>
        {isLoading ? (
          <div className="px-4.5 py-4 text-xs text-indigo/50">Loading…</div>
        ) : !donations?.length ? (
          <div className="px-4.5 py-4 text-xs text-indigo/50">No donations with this status.</div>
        ) : (
          donations.map((d) => (
            <div
              key={d._id}
              className="grid grid-cols-5 px-4.5 py-2.5 text-xs border-t border-indigo/10"
            >
              <div>
                {d.donorName}
                <div className="text-indigo/40">{d.email}</div>
              </div>
              <div className="capitalize">{d.category?.replace('_', ' ')}</div>
              <div>₹{d.amount.toLocaleString('en-IN')}</div>
              <div className="text-indigo/50 truncate">{d.razorpayPaymentId || '-'}</div>
              <div className="text-indigo/50">{new Date(d.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
