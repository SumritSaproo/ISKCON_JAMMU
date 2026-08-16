const PDFDocument = require('pdfkit');

/**
 * Builds a donation receipt PDF in memory and resolves with a Buffer,
 * ready to attach to an email or save.
 */
function buildDonationReceiptPdf(donation) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('ISKCON Jammu', { align: 'center' });
    doc.fontSize(10).fillColor('#666').text('Dream City, Muthi, Jammu', { align: 'center' });
    doc.moveDown(2);

    doc.fillColor('#000').fontSize(14).text('Donation Receipt', { align: 'center' });
    doc.moveDown(1.5);

    const rows = [
      ['Receipt No.', String(donation._id)],
      ['Date', new Date(donation.createdAt || Date.now()).toLocaleDateString('en-IN')],
      ['Donor Name', donation.donorName],
      ['Email', donation.email],
      ['Phone', donation.phone],
      ['Category', (donation.category || '').replace('_', ' ')],
      ['Amount', `INR ${Number(donation.amount).toLocaleString('en-IN')}`],
      ['Payment ID', donation.razorpayPaymentId || '-'],
      ['Status', donation.status],
    ];
    if (donation.panNumber) rows.push(['PAN', donation.panNumber]);

    rows.forEach(([label, value]) => {
      doc.fontSize(11).fillColor('#333').text(label, { continued: true, width: 150 });
      doc.fillColor('#000').text(`  ${value}`);
      doc.moveDown(0.4);
    });

    doc.moveDown(2);
    doc.fontSize(9).fillColor('#888').text(
      'Thank you for your generous contribution. This receipt confirms your donation to ISKCON Jammu.',
      { align: 'center' }
    );

    doc.end();
  });
}

module.exports = { buildDonationReceiptPdf };
