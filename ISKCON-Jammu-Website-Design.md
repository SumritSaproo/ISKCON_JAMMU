# ISKCON Jammu Website — Complete MERN Stack Design
**Location context:** ISKCON Temple, Dream City, Muthi, Jammu

---

## 1. Goals & Guiding Principles

- **Content-heavy, low-latency public site** (most visitors are read-only devotees).
- **Admin-manageable** — temple staff with no coding skills should update events, donations, gallery.
- **Scalable from day one** — monolith to start, but structured so it can split into services later without a rewrite.
- **Payment-safe** — donation/seva payments must be PCI-compliant via a gateway, never storing card data.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite, TypeScript | Fast builds, type safety as codebase grows |
| Styling | Tailwind CSS | Rapid, consistent UI; easy for future devs to maintain |
| State/data | React Query (TanStack) + Context | Caching, background refetch, avoids Redux boilerplate |
| Backend | Node.js + Express (or Fastify) | Matches your MERN experience, huge ecosystem |
| Database | MongoDB Atlas | Managed, auto-scaling, matches MERN |
| Auth | JWT (access + refresh tokens), bcrypt | Stateless, scales horizontally |
| File/Media storage | Cloudinary or AWS S3 + CloudFront | Never store images in MongoDB or local disk |
| Payments | Razorpay (India-first, UPI support) | Best for INR donations/seva bookings |
| Search | MongoDB Atlas Search (later: Elasticsearch) | Good enough at low scale, upgrade path exists |
| Caching | Redis | Session store, rate limiting, hot data (events, timings) |
| Hosting | Frontend: Vercel/Netlify. Backend: Render/Railway → AWS ECS later | Cheap start, clear scale path |
| CI/CD | GitHub Actions | Free, standard |
| Monitoring | Sentry (errors) + Atlas metrics | Catch issues before users report them |

---

## 3. Core Features (Public Site)

1. **Home** — daily darshan timings, aarti schedule, hero banner, upcoming festival highlight
2. **About ISKCON Jammu** — history, founder-acharya info, deities
3. **Darshan & Temple Timings** — dynamic, admin-editable (seasonal changes)
4. **Events & Festivals** — calendar view (Janmashtami, Ratha Yatra, etc.) with RSVP
5. **Donations / Seva** — categorized (Annadaan, Deity Seva, Construction Fund) with Razorpay checkout + auto-generated receipt (PDF + email)
6. **Gallery** — photos/videos, lazy-loaded, categorized by event
7. **Blog / Spiritual Articles** — Krishna consciousness content, searchable
8. **Live Darshan / YouTube embed** — for festival streaming
9. **Contact & Location** — embedded map (Muthi, Jammu), contact form
10. **Volunteer / Bhakti Vriksha registration**
11. **Newsletter signup**
12. **Multi-language toggle** (English/Hindi at minimum) — plan schema for this from day one

## 4. Admin Panel (separate React app or route-protected section)

- Manage events, gallery, blog posts, timings (CRUD)
- View/export donation reports
- Manage volunteer/RSVP registrations
- Role-based access (Super Admin, Content Editor, Accounts)

---

## 5. High-Level Architecture

```
                     ┌─────────────────────┐
                     │   Cloudflare / CDN   │  (static assets, DDoS protection)
                     └──────────┬──────────┘
                                │
                ┌───────────────┴───────────────┐
                │                                │
        ┌───────▼───────┐               ┌────────▼────────┐
        │  React Frontend│               │  Admin Panel SPA │
        │  (Vercel)      │               │  (route-guarded) │
        └───────┬────────┘               └────────┬────────┘
                │            REST/GraphQL API      │
                └───────────────┬───────────────────┘
                                │
                     ┌──────────▼───────────┐
                     │   Express API Server  │
                     │  (Node.js, modular)   │
                     └─────┬─────────┬───────┘
                           │         │
                  ┌────────▼──┐   ┌──▼─────────┐
                  │  MongoDB   │   │   Redis    │
                  │  Atlas     │   │  (cache/   │
                  │            │   │  sessions) │
                  └────────────┘   └────────────┘
                           │
                  ┌────────▼──────────┐
                  │  S3/Cloudinary +   │
                  │  Razorpay (payments)│
                  └────────────────────┘
```

Start as a **modular monolith** (one Express app, but internally split by domain module: `events`, `donations`, `gallery`, `users`). This lets you later extract, say, `donations` into its own microservice with almost no refactor, because each module already owns its own routes/controllers/models.

---

## 6. Backend Folder Structure

```
server/
├── src/
│   ├── modules/
│   │   ├── events/
│   │   │   ├── event.model.ts
│   │   │   ├── event.controller.ts
│   │   │   ├── event.routes.ts
│   │   │   ├── event.service.ts
│   │   │   └── event.validation.ts
│   │   ├── donations/
│   │   ├── gallery/
│   │   ├── blog/
│   │   ├── users/          (admin + roles)
│   │   ├── volunteers/
│   │   └── settings/       (timings, banners — singleton doc)
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── rateLimiter.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── config/
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   ├── cloudinary.ts
│   │   └── razorpay.ts
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── tests/
└── package.json
```

**Why this matters for scaling:** each `module` folder is self-contained (model + controller + routes + service). When traffic on `donations` grows disproportionately (likely, during festivals), you literally copy that folder into a new service, point it at the same MongoDB Atlas cluster (or split the DB), and put it behind its own route in an API gateway — no rewrite of business logic.

---

## 7. Frontend Folder Structure

```
client/
├── src/
│   ├── pages/           (route-level components)
│   ├── components/
│   │   ├── common/       (Button, Card, Modal — design system)
│   │   ├── layout/       (Navbar, Footer)
│   │   └── features/     (EventCard, DonationForm, GalleryGrid)
│   ├── hooks/
│   ├── api/              (axios instance + React Query hooks per module)
│   ├── contexts/         (Auth, Language)
│   ├── locales/          (en.json, hi.json)
│   └── App.tsx
```

---

## 8. Database Schema (MongoDB — key collections)

**events**
```js
{ title, slug, description, startDate, endDate, coverImage,
  location, rsvpEnabled, rsvpCount, category, isFeatured, createdBy }
```

**donations**
```js
{ donorName, email, phone, amount, category /* seva|annadaan|construction */,
  razorpayOrderId, razorpayPaymentId, status /* created|paid|failed */,
  receiptSent, panNumber (optional, for 80G), createdAt }
```

**gallery**
```js
{ eventId (ref), imageUrl, thumbnailUrl, caption, tags[], uploadedBy }
```

**blogPosts**
```js
{ title, slug, contentHtml, author, tags[], language, publishedAt, coverImage }
```

**users** (admin/staff only — public users don't need accounts unless you add member login later)
```js
{ name, email, passwordHash, role /* superadmin|editor|accounts */ }
```

**settings** (single document)
```js
{ darshanTimings: { morning, evening }, aartiSchedule[], announcementBanner }
```

Index `slug` fields, `startDate` on events, and `status`+`createdAt` on donations for fast admin filtering.

---

## 9. Scalability Strategy (concrete, in order you'd actually do them)

1. **Stateless API servers** from day one (JWT, no server-side sessions) → horizontal scaling is just adding instances behind a load balancer.
2. **CDN + image optimization** (Cloudinary transforms) — this alone handles most traffic spikes since galleries/festival photos are the heaviest load.
3. **Redis caching** for read-heavy, rarely-changing data: darshan timings, homepage banner, upcoming events list. Cache-aside pattern with a short TTL (5–10 min) is enough.
4. **Database indexing + read replicas** on MongoDB Atlas before you ever need sharding — Atlas makes this a config change, not a migration.
5. **Queue heavy/slow work** (sending donation receipt emails/PDFs, resizing images) via a lightweight job queue (BullMQ + Redis) instead of doing it inline in the request — keeps API response times fast during festival traffic spikes.
6. **Rate limiting** on donation and contact-form endpoints to prevent abuse.
7. **Split out `donations` as its own service** only once traffic actually demands it (e.g., before a major festival where you expect thousands of transactions) — the modular structure above makes this a low-risk move.
8. **Move to container orchestration (ECS/Kubernetes)** only when you have multiple services to coordinate — don't do this prematurely, it adds ops overhead you don't need at launch.

---

## 10. Security Checklist

- HTTPS everywhere (free via Vercel/Render/Cloudflare)
- Helmet.js for HTTP headers, express-rate-limit on all public POST routes
- Input validation with Zod/Joi on every endpoint
- Never trust client-side amount for donations — always verify against Razorpay order on the server
- Environment secrets in `.env`, never committed; use Render/Vercel secret managers in production
- Regular MongoDB Atlas backups (daily snapshot, enabled by default on paid tiers)

---

## 11. Suggested Build Order (for a solo/small team)

1. Backend skeleton + MongoDB models + auth for admin
2. Public pages: Home, About, Timings, Contact (static-ish content, easiest wins)
3. Events module (CRUD + public listing)
4. Gallery module
5. Donations module + Razorpay integration (get this right — it's the highest-stakes feature)
6. Blog module
7. Admin panel polish + role-based access
8. Multi-language pass
9. Performance pass (caching, image optimization, Lighthouse audit)
10. Deploy + monitoring setup

---

## 12. Deployment Plan (cheap → production-grade)

- **MVP:** Vercel (frontend) + Render free/hobby (backend) + MongoDB Atlas free tier + Cloudinary free tier — $0/month, fine for pre-launch and low traffic.
- **Growth:** Render paid tier or migrate backend to AWS (EC2/ECS) + Atlas dedicated cluster + CloudFront CDN.
- **Domain + email:** point your domain via Cloudflare (also gives you free DDoS protection and caching in front of Vercel).
