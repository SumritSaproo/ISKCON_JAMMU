const nodemailer = require('nodemailer');

// Works with any SMTP provider (SendGrid, Resend, Amazon SES, Gmail app
// password, etc.) — just point SMTP_HOST/PORT/USER/PASS at whichever you
// choose. No provider-specific SDK, so swapping providers is a config change.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

const FROM = process.env.SMTP_FROM || 'ISKCON Jammu <no-reply@iskconjammu.org>';

async function sendMail({ to, subject, html, text, attachments }) {
  if (!process.env.SMTP_HOST) {
    // No SMTP configured — log instead of throwing, so the rest of the
    // request (e.g. a donation) still succeeds even without email set up.
    console.warn(`[email] SMTP not configured, skipping email to ${to}: "${subject}"`);
    return { skipped: true };
  }
  return transporter.sendMail({ from: FROM, to, subject, html, text, attachments });
}

module.exports = { sendMail };
