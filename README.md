# ISKCON Jammu Website — Full Project

MERN-stack website for ISKCON Jammu (Dream City, Muthi, Jammu). Every planned feature is
implemented end-to-end: public site, donation payments, admin panel, and the supporting
email/notification flows.

## What's included

**Public site** — Home, About, Events (list, detail, RSVP), Donation/Seva (live Razorpay
checkout), Gallery, Blog (bilingual EN/HI), Volunteer registration, Contact form, Newsletter
signup (in the footer).

**Admin panel** (`/admin`) — Login (JWT, auto-refreshing session), Dashboard with live stats,
Events CRUD, Donations table, Gallery upload (Cloudinary), Blog CRUD, Volunteer pipeline
management, Contact message inbox, Site settings (darshan timings, banner).

**Backend modules** — `events` (incl. RSVP), `donations` (Razorpay order + signature
verification + PDF receipt emailed automatically), `gallery`, `blog`, `users` (admin auth),
`settings`, `volunteers`, `contact`, `newsletter`. Every module follows the same
model → service/validation → controller → routes structure, so extending or extracting any
one of them later is a contained change.

## Structure

```
iskcon-jammu-project/
├── ISKCON-Jammu-Website-Design.md   # Architecture doc: stack, DB schema, scaling plan
├── screen-previews.html             # Open in a browser — visual mockups of all screens
├── backend/                         # Express + MongoDB API — see backend/README.md
│   └── src/modules/                 # events, donations, gallery, blog, users, settings,
│                                     # volunteers, contact, newsletter
└── frontend/                        # React + Vite + Tailwind app
    ├── src/pages/                   # All public pages wired to live APIs
    ├── src/admin/                   # Full admin panel (login, dashboard, all CRUD screens)
    └── src/api/                     # axios client (with auto token refresh) + React Query hooks
```

## Quick start

**1. Backend**
```bash
cd backend
cp .env.example .env      # fill in MongoDB, Redis, Cloudinary, Razorpay, SMTP — see below
npm install
npm run dev                # http://localhost:5000
```

**2. Frontend**
```bash
cd frontend
cp .env.example .env       # set VITE_RAZORPAY_KEY_ID to match backend's RAZORPAY_KEY_ID
npm install
npm run dev                 # http://localhost:5173 — proxies /api to the backend
```

**3. First admin user** — no public signup route by design. Insert the first `superadmin`
directly in MongoDB. See `backend/README.md` for the exact command (uses bcrypt to hash the
password first).

**4. Log in to the admin panel** at `http://localhost:5173/admin/login`.

## What still needs real-world setup

Code alone can't finish these — they require accounts, credentials, or infrastructure outside
this repository:

- **MongoDB Atlas** — connection string for `MONGO_URI`
- **Razorpay** — a KYC-approved account for live payments (test-mode keys work immediately;
  live keys require Razorpay's business verification, which takes a few days)
- **SMTP provider** (SendGrid, Resend, Amazon SES, or a Gmail app password) — without this,
  the app runs fine but skips sending donation receipts, contact notifications, volunteer
  confirmations, and newsletter welcome emails (logged as warnings instead of failing)
- **Redis** — optional; the app runs without it (no caching, in-memory rate limiting), but a
  managed instance (Upstash/Redis Cloud) is recommended before production traffic
- **Cloudinary** — needed specifically for gallery/blog image uploads; everything else works
  without it
- **Domain, hosting, SSL, backups, monitoring** — see the design doc's deployment section
- **Security review and load testing** — no codebase can substitute for this before a real
  donation flow goes live; test with Razorpay's test-mode keys thoroughly first

## Where to go next

- `ISKCON-Jammu-Website-Design.md` covers the "why" behind every architectural choice and the
  concrete scaling steps (caching, queueing, splitting services).
- `screen-previews.html` is the original visual reference the built pages follow.
- `backend/src/modules/events/` and `frontend/src/admin/pages/EventsAdmin.jsx` are the most
  fully-featured reference implementations — use them as the template if you add new modules.
