const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'singleton' },
    darshanTimings: {
      morning: { type: String, default: '4:30 AM - 1:00 PM' },
      evening: { type: String, default: '4:00 PM - 8:30 PM' },
    },
    aartiSchedule: [
      {
        name: String, // e.g. "Mangala Aarti"
        time: String,
      },
    ],
    announcementBanner: { type: String, default: '' },
    backgroundImage: { type: String, default: '' },
    backgroundImagePublicId: { type: String, default: '' },
    backgroundImageOpacity: { type: Number, min: 0, max: 1, default: 1 },
    home: {
      eyebrow: { type: String, default: 'Hare Krishna · Welcome' },
      title: { type: String, default: 'A home for Krishna\nconsciousness in Jammu' },
      description: {
        type: String,
        default:
          'Join us for daily darshan, kirtan and prasadam at ISKCON Jammu — nestled in Dream City, Muthi. All are welcome, every day of the year.',
      },
      primaryCta: { type: String, default: "Today's Darshan Timings" },
      secondaryCta: { type: String, default: 'Plan a Visit' },
    },
    about: {
      eyebrow: { type: String, default: 'Our Story' },
      title: { type: String, default: 'About ISKCON Jammu' },
      paragraphOne: {
        type: String,
        default:
          'ISKCON Jammu, situated in Dream City, Muthi, serves as a spiritual home for devotees across the region — offering daily worship, scriptural study and community festivals rooted in the Gaudiya Vaishnava tradition founded by Srila Prabhupada.',
      },
      paragraphTwo: {
        type: String,
        default:
          'The temple welcomes visitors of every background for darshan, kirtan, and prasadam — with a growing congregation active in seva, youth programs and outreach across Jammu.',
      },
      deitiesHeading: { type: String, default: 'Presiding Deities' },
      deitiesText: { type: String, default: 'Sri Sri Radha Krishna' },
      founderHeading: { type: String, default: 'Founder-Acharya' },
      founderText: {
        type: String,
        default: 'His Divine Grace A.C. Bhaktivedanta Swami Prabhupada',
      },
    },
    footer: {
      brand: { type: String, default: 'ISKCON Jammu' },
      description: {
        type: String,
        default: 'Dream City, Muthi, Jammu, J&K — a home for Krishna consciousness in the region.',
      },
      contactHeading: { type: String, default: 'Contact' },
      contactText: { type: String, default: 'info@iskconjammu.org\n+91 XXXXX XXXXX' },
      timingsHeading: { type: String, default: 'Daily Timings' },
      timingsText: { type: String, default: 'Mangala Aarti — 4:30 AM\nSandhya Aarti — 7:00 PM' },
      newsletterHeading: { type: String, default: 'Newsletter' },
      newsletterPlaceholder: { type: String, default: 'Your email' },
      newsletterButton: { type: String, default: 'Join' },
      newsletterSuccess: { type: String, default: 'Subscribed — thank you!' },
    },
  },
  { timestamps: true }
);

// Enforce a single settings document via a fixed _id.
settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findById('singleton');
  if (!doc) doc = await this.create({ _id: 'singleton' });
  return doc;
};

module.exports = mongoose.model('Settings', settingsSchema);
