import { useUpcomingEvents } from '../../api/events';
import { useAdminDonations } from '../../api/admin';
import { useAdminVolunteers } from '../../api/admin';
import { useGallery } from '../../api/content';

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-indigo/10 rounded-lg p-4">
      <div className="text-[10.5px] text-indigo/60">{label}</div>
      <div className="font-display font-semibold text-xl text-indigo">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data: events } = useUpcomingEvents();
  const { data: donations } = useAdminDonations({ status: 'paid', limit: 200 });
  const { data: volunteers } = useAdminVolunteers({ status: 'new' });
  const { data: images } = useGallery({ limit: 1 });

  const totalDonations = (donations || []).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div className="font-display font-semibold text-lg text-indigo mb-5">
        Welcome back, Temple Admin
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
        <StatCard label="Donations Received" value={`₹${totalDonations.toLocaleString('en-IN')}`} />
        <StatCard label="Upcoming Events" value={events?.length ?? '—'} />
        <StatCard label="New Volunteer Signups" value={volunteers?.length ?? '—'} />
        <StatCard label="Gallery Photos" value={images?.length ?? '—'} />
      </div>

      <div className="bg-white border border-indigo/10 rounded-lg overflow-hidden">
        <div className="px-4.5 py-3.5 border-b border-indigo/10 text-[12.5px] font-semibold text-indigo">
          Recent Donations
        </div>
        <div className="grid grid-cols-4 px-4.5 py-2.5 text-[10.5px] text-indigo/50 uppercase tracking-wide">
          <div>Donor</div>
          <div>Category</div>
          <div>Amount</div>
          <div>Status</div>
        </div>
        {(donations || []).slice(0, 6).map((d) => (
          <div key={d._id} className="grid grid-cols-4 px-4.5 py-2.5 text-xs border-t border-indigo/10">
            <div>{d.donorName}</div>
            <div className="capitalize">{d.category?.replace('_', ' ')}</div>
            <div>₹{d.amount.toLocaleString('en-IN')}</div>
            <div className="text-teal">● Paid</div>
          </div>
        ))}
        {!donations?.length && (
          <div className="px-4.5 py-4 text-xs text-indigo/50">No donations yet.</div>
        )}
      </div>
    </div>
  );
}
