# ISKCON Jammu — Backend API

Modular Express + MongoDB backend for the ISKCON Jammu (Dream City, Muthi) website.
Every module listed below is fully implemented — no stubs.

## Structure

Each feature lives in its own self-contained module under `src/modules/`
(model + routes + service/validation as needed). This is what lets any module be
pulled out into its own microservice later without touching business logic.

```
src/
├── config/       # db, redis, cloudinary, razorpay (lazy-init) clients
├── middlewares/  # auth, Redis-backed rate limiting, validation, error handling
├── utils/        # email (Nodemailer), PDF receipt generation (pdfkit)
├── modules/
│   ├── events/       # CRUD + RSVP
│   ├── donations/    # Razorpay order + signature verification + emailed PDF receipt
│   ├── gallery/       # Cloudinary upload with file-type validation
│   ├── blog/          # bilingual (en/hi) CRUD
│   ├── users/          # admin auth (JWT access + refresh)
│   ├── settings/       # singleton doc: darshan timings, banner
│   ├── volunteers/     # registration + admin pipeline management
│   ├── contact/        # contact form + office notification email
│   └── newsletter/     # subscribe/unsubscribe + welcome email
├── app.js
└── server.js
```

## Setup

```bash
cp .env.example .env      # fill in MongoDB Atlas URI at minimum to start
npm install
npm run dev                # nodemon, http://localhost:5000
```

The app boots even with Redis, Cloudinary, Razorpay, and SMTP unset — those features degrade
gracefully (no caching, gallery uploads fail until Cloudinary is set, donations return a clear
502 until Razorpay is set, emails are skipped with a console warning). Only `MONGO_URI` is
required to start the server.

## Creating the first admin user

There's no public registration by design. Generate a bcrypt hash, then insert the user
directly in MongoDB (Atlas UI or `mongosh`):

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('YOUR_REAL_PASSWORD', 12).then(h => console.log(h));"
```

```js
db.users.insertOne({
  name: "Temple Admin",
  email: "admin@iskconjammu.org",
  passwordHash: "<paste the hash from above>",
  role: "superadmin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

After that, `POST /api/auth/login` returns a JWT, and that admin can create further staff
accounts via `POST /api/auth/` (superadmin only), or manage everything from the admin panel
at `/admin` on the frontend.

## API overview

| Method | Route | Access |
|---|---|---|
| GET | `/api/events` | Public |
| GET | `/api/events/:slug` | Public |
| POST | `/api/events/:id/rsvp` | Public (rate-limited) |
| POST/PATCH/DELETE | `/api/events` | Editor/Superadmin |
| POST | `/api/donations/initiate` | Public (rate-limited) |
| POST | `/api/donations/verify` | Public (rate-limited) |
| GET | `/api/donations` | Accounts/Superadmin |
| GET | `/api/gallery` | Public |
| POST | `/api/gallery` | Editor/Superadmin |
| GET | `/api/blog`, `/api/blog/:slug` | Public |
| POST/PATCH/DELETE | `/api/blog` | Editor/Superadmin |
| POST | `/api/volunteers` | Public (rate-limited) |
| GET/PATCH | `/api/volunteers` | Editor/Superadmin |
| POST | `/api/contact` | Public (rate-limited) |
| GET/PATCH | `/api/contact` | Editor/Superadmin |
| POST | `/api/newsletter` | Public (rate-limited) |
| POST | `/api/newsletter/unsubscribe` | Public |
| GET | `/api/newsletter` | Editor/Superadmin |
| POST | `/api/auth/login`, `/api/auth/refresh` | Public |
| GET/PATCH | `/api/settings` | Public read / Editor write |

## Before going live

1. Get Razorpay live keys (requires KYC approval — start this early).
2. Set up an SMTP provider so donation receipts, contact notifications, volunteer
   confirmations, and newsletter emails actually send.
3. Point `REDIS_URL` at a managed instance for accurate caching and rate limiting once you're
   running more than one server instance.
4. Run the donation flow end-to-end with Razorpay **test-mode** keys before switching to live
   keys — this is the highest-stakes path in the app.
5. Add automated tests around signature verification in `donation.service.js` before launch.
