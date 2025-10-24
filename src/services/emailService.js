const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send ticket email
 */
async function sendTicketEmail({ email, namaLengkap, transaction, wisata }) {
  try {
    const ticketUrl = `${process.env.FRONTEND_URL}/ticket/${transaction.id}`;
    
    const mailOptions = {
      from: `"Wisata Baturaden" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `E-Ticket Wisata ${wisata.nama} - Order #${transaction.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #5B903A 0%, #4a7a2f 100%);
              color: white;
              padding: 32px 24px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 32px 24px;
            }
            .ticket-card {
              background: #f8faf9;
              border: 2px solid #5B903A;
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              color: #6b7280;
              font-weight: 500;
            }
            .value {
              color: #111827;
              font-weight: 600;
            }
            .price {
              font-size: 24px;
              color: #5B903A;
              font-weight: 700;
            }
            .button {
              display: inline-block;
              background: #5B903A;
              color: white;
              padding: 14px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              margin: 16px 0;
            }
            .footer {
              background: #f9fafb;
              padding: 24px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
            .qr-code {
              text-align: center;
              margin: 24px 0;
            }
            .important {
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 16px;
              margin: 24px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 E-Ticket Wisata Baturaden</h1>
            </div>
            
            <div class="content">
              <p>Halo <strong>${namaLengkap}</strong>,</p>
              <p>Terima kasih telah melakukan pemesanan! Berikut detail tiket Anda:</p>
              
              <div class="ticket-card">
                <h2 style="margin-top: 0; color: #5B903A;">📍 ${wisata.nama}</h2>
                
                <div class="info-row">
                  <span class="label">Order ID</span>
                  <span class="value">${transaction.orderId}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Lokasi</span>
                  <span class="value">${wisata.lokasi}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Tanggal Kunjungan</span>
                  <span class="value">${new Date(transaction.tanggalKunjungan).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Jumlah Tiket</span>
                  <span class="value">${transaction.jumlahTiket} Tiket</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Total Pembayaran</span>
                  <span class="price">Rp ${transaction.totalHarga.toLocaleString('id-ID')}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Status</span>
                  <span class="value" style="color: #10b981;">✓ LUNAS</span>
                </div>
              </div>

              <div class="qr-code">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketUrl}" 
                     alt="QR Code" 
                     style="border: 2px solid #5B903A; border-radius: 8px; padding: 8px; background: white;">
                <p style="margin-top: 12px; color: #6b7280; font-size: 14px;">Scan QR code saat masuk lokasi wisata</p>
              </div>

              <div style="text-align: center;">
                <a href="${ticketUrl}" class="button">Lihat Detail Tiket</a>
              </div>

              <div class="important">
                <strong>📌 Penting:</strong>
                <ul style="margin: 8px 0; padding-left: 20px;">
                  <li>Simpan email ini sebagai bukti pemesanan</li>
                  <li>Tunjukkan QR code atau Order ID saat masuk</li>
                  <li>Tiket berlaku untuk tanggal yang dipilih</li>
                  <li>Datang 15 menit sebelum jam buka untuk check-in</li>
                </ul>
              </div>

              ${wisata.jamBuka && wisata.jamTutup ? `
                <p style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <strong>⏰ Jam Operasional:</strong> ${wisata.jamBuka} - ${wisata.jamTutup} WIB
                </p>
              ` : ''}

              ${wisata.kontak ? `
                <p style="color: #6b7280;">
                  <strong>📞 Kontak:</strong> ${wisata.kontak}
                </p>
              ` : ''}
            </div>
            
            <div class="footer">
              <p><strong>Wisata Baturaden</strong></p>
              <p>Destinasi wisata terbaik di Purwokerto</p>
              <p style="margin-top: 16px; font-size: 12px;">
                Email ini dikirim otomatis, mohon tidak membalas email ini.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment pending email
 */
async function sendPaymentPendingEmail({ email, namaLengkap, transaction, wisata, paymentUrl }) {
  try {
    const mailOptions = {
      from: `"Wisata Baturaden" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Menunggu Pembayaran - Order #${transaction.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: #f59e0b; color: white; padding: 24px; text-align: center; }
            .content { padding: 24px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏳ Menunggu Pembayaran</h1>
            </div>
            <div class="content">
              <p>Halo <strong>${namaLengkap}</strong>,</p>
              <p>Pesanan Anda telah dibuat dan menunggu pembayaran:</p>
              <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p><strong>Destinasi:</strong> ${wisata.nama}</p>
                <p><strong>Order ID:</strong> ${transaction.orderId}</p>
                <p><strong>Total:</strong> Rp ${transaction.totalHarga.toLocaleString('id-ID')}</p>
              </div>
              <p>Silakan selesaikan pembayaran sebelum batas waktu:</p>
              <div style="text-align: center;">
                <a href="${paymentUrl}" class="button">Bayar Sekarang</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendTicketEmail,
  sendPaymentPendingEmail,
};