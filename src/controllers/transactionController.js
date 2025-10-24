const { PrismaClient } = require('@prisma/client');
const { snap, coreApi } = require('../config/midtrans');
const { sendTicketEmail, sendPaymentPendingEmail } = require('../services/emailService');
const { sendTicketWhatsApp, sendPaymentPendingWhatsApp } = require('../services/whatsappService');
const prisma = new PrismaClient();

/**
 * Create transaction (guest or logged-in user)
 */
const createTransaction = async (req, res) => {
  try {
    const { wisataId, jumlahTiket, tanggalKunjungan, namaLengkap, email, noTelp } = req.body;
    
    // Validasi input
    if (!wisataId || !jumlahTiket || !tanggalKunjungan || !namaLengkap || !email || !noTelp) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    // Get wisata
    const wisata = await prisma.wisataDesa.findUnique({
      where: { id: wisataId }
    });

    if (!wisata || !wisata.isAktif) {
      return res.status(404).json({
        success: false,
        message: 'Wisata tidak ditemukan atau tidak aktif'
      });
    }

    const totalHarga = wisata.harga * parseInt(jumlahTiket);
    const orderId = `WIS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create transaction (userId nullable untuk guest)
    const userId = req.user?.id || null; // Optional chaining untuk auth optional

    const transaction = await prisma.transaction.create({
      data: {
        userId, // Bisa null untuk guest
        wisataId,
        jumlahTiket: parseInt(jumlahTiket),
        totalHarga,
        tanggalKunjungan: new Date(tanggalKunjungan),
        namaLengkap,
        email,
        noTelp,
        orderId,
        status: 'PENDING'
      },
      include: {
        user: userId ? {
          select: {
            id: true,
            name: true,
            email: true
          }
        } : false,
        wisata: true
      }
    });

    // Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalHarga
      },
      customer_details: {
        first_name: namaLengkap,
        email: email,
        phone: noTelp
      },
      item_details: [
        {
          id: wisataId,
          price: wisata.harga,
          quantity: parseInt(jumlahTiket),
          name: wisata.nama
        }
      ],
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/payment/success?order_id=${orderId}`
      }
    };

    // Create Midtrans transaction
    const midtransTransaction = await snap.createTransaction(parameter);

    // Send payment pending notification
    const paymentUrl = midtransTransaction.redirect_url;
    
    // Email & WhatsApp (async, don't wait)
    Promise.all([
      sendPaymentPendingEmail({ 
        email, 
        namaLengkap, 
        transaction, 
        wisata, 
        paymentUrl 
      }),
      sendPaymentPendingWhatsApp({ 
        phone: noTelp, 
        namaLengkap, 
        transaction, 
        wisata, 
        paymentUrl 
      })
    ]).catch(err => console.error('Notification error:', err));

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      data: {
        transaction,
        payment: {
          token: midtransTransaction.token,
          redirect_url: paymentUrl
        }
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat transaksi',
      error: error.message
    });
  }
};

/**
 * Handle Midtrans payment notification (webhook)
 */
const handleMidtransNotification = async (req, res) => {
  try {
    const notification = req.body;
    
    const statusResponse = await coreApi.transaction.notification(notification);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    console.log(`📬 Notification for ${orderId}: ${transactionStatus}`);

    let status = 'PENDING';

    // Determine status
    if (transactionStatus === 'capture') {
      status = fraudStatus === 'accept' ? 'PAID' : 'PENDING';
    } else if (transactionStatus === 'settlement') {
      status = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      status = 'CANCELLED';
    } else if (transactionStatus === 'pending') {
      status = 'PENDING';
    }

    // Update data
    const updateData = {
      status,
      transactionId: statusResponse.transaction_id,
      paymentType: paymentType
    };

    if (paymentType === 'bank_transfer') {
      updateData.vaNumber = statusResponse.va_numbers?.[0]?.va_number;
      updateData.bank = statusResponse.va_numbers?.[0]?.bank;
    }

    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { orderId },
      data: updateData,
      include: {
        wisata: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // ✅ Send ticket when payment is successful
    if (status === 'PAID') {
      console.log(`✅ Payment SUCCESS for ${orderId}, sending ticket...`);
      
      // Send email & WhatsApp notifications
      Promise.all([
        sendTicketEmail({
          email: transaction.email,
          namaLengkap: transaction.namaLengkap,
          transaction,
          wisata: transaction.wisata
        }),
        sendTicketWhatsApp({
          phone: transaction.noTelp,
          namaLengkap: transaction.namaLengkap,
          transaction,
          wisata: transaction.wisata
        })
      ]).catch(err => console.error('Notification error:', err));
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Midtrans notification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get transaction by ID (public - for guest ticket view)
 */
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        wisata: true
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get transaction by orderId (for payment success page)
 */
const getTransactionByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        wisata: true
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get my transactions (authenticated user only)
 */
const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        wisata: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all transactions (admin only)
 */
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        wisata: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createTransaction,
  handleMidtransNotification,
  getTransactionById,
  getTransactionByOrderId,
  getAllTransactions,
  getMyTransactions
};