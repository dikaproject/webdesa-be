const axios = require('axios');

const FONNTE_API_URL = process.env.FONNTE_API_URL || 'https://api.fonnte.com/send';
const FONNTE_TOKEN = process.env.FONNTE_TOKEN;

/**
 * Send WhatsApp ticket message
 */
async function sendTicketWhatsApp({ phone, namaLengkap, transaction, wisata }) {
  try {
    // Format phone: hapus 0 di depan, tambah 62
    let formattedPhone = phone.replace(/^0/, '62');
    if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone;
    }

    const ticketUrl = `${process.env.FRONTEND_URL}/ticket/${transaction.id}`;
    
    const message = `
🎫 *E-TICKET WISATA BATURADEN*

Halo *${namaLengkap}*,

Pembayaran Anda telah berhasil! Berikut detail tiket:

📍 *Destinasi:* ${wisata.nama}
🆔 *Order ID:* ${transaction.orderId}
📅 *Tanggal:* ${new Date(transaction.tanggalKunjungan).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
🎟️ *Jumlah Tiket:* ${transaction.jumlahTiket} orang
💰 *Total:* Rp ${transaction.totalHarga.toLocaleString('id-ID')}
✅ *Status:* LUNAS

📍 *Lokasi:* ${wisata.lokasi}
${wisata.jamBuka && wisata.jamTutup ? `⏰ *Jam:* ${wisata.jamBuka} - ${wisata.jamTutup} WIB` : ''}

🔗 *Lihat E-Ticket:*
${ticketUrl}

📌 *PENTING:*
• Simpan pesan ini sebagai bukti
• Tunjukkan Order ID saat masuk
• Tiket berlaku untuk tanggal yang dipilih
• Datang 15 menit lebih awal

Terima kasih telah memesan!

_Wisata Baturaden - Destinasi Terbaik di Purwokerto_
    `.trim();

    const response = await axios.post(
      FONNTE_API_URL,
      {
        target: formattedPhone,
        message: message,
        countryCode: '62',
      },
      {
        headers: {
          Authorization: FONNTE_TOKEN,
        },
      }
    );

    console.log('✅ WhatsApp sent:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ WhatsApp error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send payment pending WhatsApp
 */
async function sendPaymentPendingWhatsApp({ phone, namaLengkap, transaction, wisata, paymentUrl }) {
  try {
    let formattedPhone = phone.replace(/^0/, '62');
    if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone;
    }

    const message = `
⏳ *MENUNGGU PEMBAYARAN*

Halo *${namaLengkap}*,

Pesanan Anda telah dibuat:

📍 *Destinasi:* ${wisata.nama}
🆔 *Order ID:* ${transaction.orderId}
💰 *Total:* Rp ${transaction.totalHarga.toLocaleString('id-ID')}
⚠️ *Status:* MENUNGGU PEMBAYARAN

Silakan selesaikan pembayaran sebelum batas waktu.

🔗 *Bayar Sekarang:*
${paymentUrl}

_Wisata Baturaden_
    `.trim();

    const response = await axios.post(
      FONNTE_API_URL,
      {
        target: formattedPhone,
        message: message,
      },
      {
        headers: {
          Authorization: FONNTE_TOKEN,
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ WhatsApp error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendTicketWhatsApp,
  sendPaymentPendingWhatsApp,
};