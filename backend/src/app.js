const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { apiLimiter } = require('./middlewares/rateLimiter');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const eventRoutes = require('./modules/events/event.routes');
const donationRoutes = require('./modules/donations/donation.routes');
const galleryRoutes = require('./modules/gallery/gallery.routes');
const blogRoutes = require('./modules/blog/blog.routes');
const userRoutes = require('./modules/users/user.routes');
const settingsRoutes = require('./modules/settings/settings.routes');
const volunteerRoutes = require('./modules/volunteers/volunteer.routes');
const contactRoutes = require('./modules/contact/contact.routes');
const newsletterRoutes = require('./modules/newsletter/subscriber.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));

// Each module owns its own router — this is what makes it easy to later
// extract, e.g., /api/donations into its own service with no logic changes.
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ISKCON Jammu Backend is running'
  });
});
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
