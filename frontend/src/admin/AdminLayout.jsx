import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getStoredUser, logout } from '../api/auth';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/events', label: 'Events', icon: '🎉' },
  { to: '/admin/donations', label: 'Donations', icon: '💰' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/blog', label: 'Blog', icon: '📝' },
  { to: '/admin/volunteers', label: 'Volunteers', icon: '🙋' },
  { to: '/admin/messages', label: 'Messages', icon: '✉️' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  return (
    <div className="min-h-screen flex">
      <aside className="w-52 bg-indigo text-ivory p-5 flex-shrink-0">
        <div className="font-display font-semibold text-marigold-soft mb-6">Admin Panel</div>
        <nav className="space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2 text-[13px] px-2.5 py-2 rounded ${
                  isActive ? 'bg-marigold/15 border border-marigold/40' : 'opacity-75'
                }`
              }
            >
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="mt-8 text-[12px] text-ivory/60 underline"
        >
          Sign out
        </button>
      </aside>

      <main className="flex-1 bg-[#FBF8F1] p-8">
        <div className="flex justify-between items-center mb-6">
          <div />
          <div className="text-xs text-indigo/60">{user?.name} &middot; {user?.role}</div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
