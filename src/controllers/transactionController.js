const { PrismaClient } = require('@prisma/client');
const { snap, coreApi } = require('../config/midtrans');
const prisma = new PrismaClient();

const createTransaction = async (req, res) => {
  try {
    const { wisataId, jumlahTiket, tanggalKunjungan, namaLengkap, noTelp } = req.body;
    const userId = req.user.id;

    const wisata = await prisma.wisataDesa.findUnique({
      where: { id: wisataId }
    });

    if (!wisata) {
      return res.status(404).json({
        success: false,
        message: 'Wisata tidak ditemukan'
      });
    }

    const totalHarga = wisata.harga * jumlahTiket;
    const orderId = `ORDER-${Date.now()}-${userId.slice(0, 8)}`;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        wisataId,
        jumlahTiket,
        totalHarga,
        tanggalKunjungan: new Date(tanggalKunjungan),
        namaLengkap,
        noTelp,
        orderId
      },
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

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalHarga
      },
      customer_details: {
        first_name: namaLengkap,
        email: req.user.email,
        phone: noTelp
      },
      item_details: [
        {
          id: wisataId,
          price: wisata.harga,
          quantity: jumlahTiket,
          name: wisata.nama
        }
      ]
    };

    const midtransTransaction = await snap.createTransaction(parameter);

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dibuat',
      data: {
        transaction,
        payment: {
          token: midtransTransaction.token,
          redirect_url: midtransTransaction.redirect_url
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const handleMidtransNotification = async (req, res) => {
  try {
    const notification = req.body;
    
    const statusResponse = await coreApi.transaction.notification(notification);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type;

    let status = 'PENDING';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        status = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      status = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      status = 'CANCELLED';
    }

    const updateData = {
      status,
      transactionId: statusResponse.transaction_id,
      paymentType: paymentType
    };

    if (paymentType === 'bank_transfer') {
      updateData.vaNumber = statusResponse.va_numbers?.[0]?.va_number;
      updateData.bank = statusResponse.va_numbers?.[0]?.bank;
    }

    await prisma.transaction.update({
      where: { orderId },
      data: updateData
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

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
  getAllTransactions,
  getMyTransactions
};