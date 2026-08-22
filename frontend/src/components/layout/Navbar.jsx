import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'Blog' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative bg-ivory border-b border-indigo/10 px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
      <div className="flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/iskconjammulogo.jpg"
          alt="ISKCON Jammu logo"
          className="w-10 h-10 rounded-full object-cover"
          draggable="false"
        />
        <div className="leading-tight">
          <div className="font-display font-semibold text-sm text-indigo">ISKCON Jammu</div>
          <div className="text-[9px] tracking-widest uppercase text-vermilion">Dream City, Muthi</div>
        </div>
      </Link>

      <div className="hidden lg:flex gap-6 text-[13px] text-indigo">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              isActive ? 'border-b-2 border-marigold pb-1 font-semibold' : 'pb-1'
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <Link
        to="/donate"
        className="hidden lg:block bg-vermilion text-ivory px-4 sm:px-5 py-2.5 rounded text-[13px] font-semibold"
      >
        Donate / Seva
      </Link>
      <button
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden border border-indigo/20 rounded px-3 py-2 text-indigo text-lg leading-none"
      >
        {isMenuOpen ? '×' : '☰'}
      </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="lg:hidden pt-3 pb-1">
          <div className="grid gap-1 text-sm text-indigo">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${isActive ? 'bg-indigo/10 font-semibold' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/donate"
              onClick={() => setIsMenuOpen(false)}
              className="bg-vermilion text-ivory px-3 py-2 rounded font-semibold mt-1"
            >
              Donate / Seva
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
