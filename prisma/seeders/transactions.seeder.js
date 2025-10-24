const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTransactions(users, wisataList) {
  console.log('🌱 Seeding Transactions...');

  // Validate inputs
  if (!wisataList || wisataList.length === 0) {
    console.error('❌ No wisata data available for transactions');
    throw new Error('Wisata list is empty');
  }

  console.log(`📍 Found ${wisataList.length} wisata destinations`);
  console.log(`📍 Sample wisata:`, wisataList[0]);

  const visitorUsers = users.filter(u => u.role === 'VISITOR' || u.role === 'WARGA');
  const now = new Date();
  const transactions = [];

  // Generate 250 transaksi dalam 6 bulan terakhir
  for (let i = 0; i < 250; i++) {
    const user = visitorUsers[Math.floor(Math.random() * visitorUsers.length)];
    const wisata = wisataList[Math.floor(Math.random() * wisataList.length)];
    
    // Validate wisata has required fields
    if (!wisata.id || !wisata.harga) {
      console.error('❌ Invalid wisata data:', wisata);
      throw new Error(`Wisata missing id or harga at index ${i}`);
    }
    
    // Random date dalam 6 bulan terakhir
    const daysAgo = Math.floor(Math.random() * 180);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    // Tanggal kunjungan random 1-30 hari dari tanggal transaksi
    const visitDate = new Date(createdAt);
    visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    const jumlahTiket = Math.floor(Math.random() * 5) + 1; // 1-5 tiket
    const totalHarga = wisata.harga * jumlahTiket;
    
    // Status distribution: 10% PENDING, 5% CANCELLED, 85% PAID
    let status;
    const rand = Math.random();
    if (rand < 0.10) status = 'PENDING';
    else if (rand < 0.15) status = 'CANCELLED';
    else status = 'PAID';

    const paymentTypes = ['bank_transfer', 'gopay', 'qris', 'ovo', 'dana'];
    const banks = ['bca', 'mandiri', 'bni', 'bri'];
    const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];

    const transactionData = {
      userId: user.id,
      wisataId: wisata.id,
      jumlahTiket: jumlahTiket,
      totalHarga: totalHarga,
      tanggalKunjungan: visitDate,
      namaLengkap: user.name,
      email: user.email, 
      noTelp: user.noTelp || `0812${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
      status: status,
      orderId: `ORDER-${Date.now()}-${i}`,
      transactionId: status === 'PAID' ? `TRX-${Date.now()}-${i}` : null,
      paymentType: status === 'PAID' ? paymentType : null,
      vaNumber: (status === 'PAID' && paymentType === 'bank_transfer') ? `8808${String(Math.floor(Math.random() * 999999999999)).padStart(12, '0')}` : null,
      bank: (status === 'PAID' && paymentType === 'bank_transfer') ? banks[Math.floor(Math.random() * banks.length)] : null,
      buktiPembayaran: status === 'PAID' ? `/uploads/transactions/payment-${i}.jpg` : null,
      pdfUrl: status === 'PAID' ? `/uploads/transactions/ticket-${i}.pdf` : null,
      expiryTime: status === 'PENDING' ? new Date(createdAt.getTime() + 24 * 60 * 60 * 1000) : null,
      createdAt: createdAt,
      updatedAt: status === 'PAID' ? new Date(createdAt.getTime() + Math.random() * 2 * 60 * 60 * 1000) : createdAt
    };

    transactions.push(transactionData);
  }

  // Create transactions in batches
  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }

  console.log(`✅ ${transactions.length} transactions created`);
  return transactions;
}

module.exports = { seedTransactions };
