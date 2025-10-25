const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate slug from nama
function generateSlug(nama) {
  return nama
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

async function seedUMKM() {
  console.log('🌱 Seeding UMKM...');

  const umkmData = [
    // Kuliner
    {
      nama: 'Warung Makan Bu Siti',
      slug: 'warung-makan-bu-siti',
      pemilik: 'Siti Aminah',
      deskripsi: 'Warung makan rumahan dengan menu masakan tradisional Sunda yang lezat dan harga terjangkau. Spesialisasi nasi timbel, pepes ikan, dan sayur asem.',
      kategori: 'Kuliner',
      alamat: 'Jl. Merdeka No. 15, RT 01/RW 02',
      kontak: '081234567901',
      produk: 'Nasi Timbel, Pepes Ikan, Sayur Asem, Ayam Goreng, Sambal Terasi',
      harga: '15.000 - 35.000',
      jamBuka: '07:00',
      jamTutup: '20:00',
      foto: '/uploads/umkm/warung-bu-siti.jpg',
      latitude: -6.9175,
      longitude: 107.6191,
      isAktif: true
    },
    {
      nama: 'Kedai Kopi Bapak',
      slug: 'kedai-kopi-bapak',
      pemilik: 'Ahmad Wijaya',
      deskripsi: 'Kedai kopi specialty dengan biji kopi pilihan dari perkebunan lokal. Suasana cozy dan instagramable, cocok untuk nongkrong dan meeting.',
      kategori: 'Kuliner',
      alamat: 'Jl. Pemuda No. 8, RT 02/RW 01',
      kontak: '081234567902',
      produk: 'Kopi Arabika, Kopi Robusta, Cappuccino, Latte, Pastry, Cake',
      harga: '15.000 - 45.000',
      jamBuka: '08:00',
      jamTutup: '22:00',
      foto: '/uploads/umkm/kedai-kopi.jpg',
      latitude: -6.9185,
      longitude: 107.6201,
      isAktif: true
    },
    {
      nama: 'Bakso Mas Budi',
      slug: 'bakso-mas-budi',
      pemilik: 'Budi Santoso',
      deskripsi: 'Bakso kuah dengan daging sapi pilihan, kuah kaldu yang gurih, dan bakso kenyal. Sudah berjualan sejak 1995 dan menjadi favorit warga.',
      kategori: 'Kuliner',
      alamat: 'Jl. Sudirman No. 25, RT 03/RW 02',
      kontak: '081234567903',
      produk: 'Bakso Sapi, Bakso Urat, Bakso Campur, Mie Ayam, Pangsit',
      harga: '15.000 - 30.000',
      jamBuka: '10:00',
      jamTutup: '21:00',
      foto: '/uploads/umkm/bakso-mas-budi.jpg',
      latitude: -6.9165,
      longitude: 107.6181,
      isAktif: true
    },
    {
      nama: 'Keripik Pisang Bu Sari',
      slug: 'keripik-pisang-bu-sari',
      pemilik: 'Sari Rahayu',
      deskripsi: 'Produsen keripik pisang dengan berbagai varian rasa. Menggunakan pisang lokal berkualitas dan diolah secara higienis. Cocok untuk oleh-oleh.',
      kategori: 'Kuliner',
      alamat: 'Jl. Raya Desa Km 2, RT 01/RW 03',
      kontak: '081234567904',
      produk: 'Keripik Pisang Original, Coklat, Keju, Balado, Manis',
      harga: '20.000 - 35.000 per pack',
      jamBuka: '08:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/keripik-pisang.jpg',
      latitude: -6.9195,
      longitude: 107.6211,
      isAktif: true
    },
    {
      nama: 'Catering Ibu Dewi',
      slug: 'catering-ibu-dewi',
      pemilik: 'Dewi Lestari',
      deskripsi: 'Jasa catering untuk acara hajatan, ulang tahun, arisan, dan meeting. Menu bervariasi dan harga kompetitif. Melayani pesanan mulai 50 porsi.',
      kategori: 'Kuliner',
      alamat: 'Jl. Kartini No. 12, RT 02/RW 02',
      kontak: '081234567905',
      produk: 'Nasi Box, Prasmanan, Snack Box, Tumpeng, Nasi Liwet',
      harga: '25.000 - 75.000 per porsi',
      jamBuka: '00:00',
      jamTutup: '23:59',
      foto: '/uploads/umkm/catering-dewi.jpg',
      latitude: -6.9155,
      longitude: 107.6171,
      isAktif: true
    },

    // Fashion
    {
      nama: 'Konveksi Jaya Abadi',
      slug: 'konveksi-jaya-abadi',
      pemilik: 'Joko Susilo',
      deskripsi: 'Konveksi produksi seragam sekolah, kantor, olahraga, dan kaos sablon. Kualitas jahitan rapi dan harga terjangkau. Melayani order partai besar dan eceran.',
      kategori: 'Fashion',
      alamat: 'Jl. Industri No. 5, RT 04/RW 03',
      kontak: '081234567906',
      produk: 'Seragam Sekolah, Seragam Kantor, Kaos Sablon, Jaket, Celana',
      harga: '50.000 - 200.000',
      jamBuka: '08:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/konveksi.jpg',
      latitude: -6.9205,
      longitude: 107.6221,
      isAktif: true
    },
    {
      nama: 'Toko Busana Muslim Berkah',
      slug: 'toko-busana-muslim-berkah',
      pemilik: 'Fatimah Zahra',
      deskripsi: 'Toko busana muslim dengan koleksi gamis, hijab, dan mukena terbaru. Harga terjangkau dengan kualitas bahan premium.',
      kategori: 'Fashion',
      alamat: 'Jl. Masjid No. 7, RT 01/RW 01',
      kontak: '081234567907',
      produk: 'Gamis, Hijab, Mukena, Koko, Sarung',
      harga: '75.000 - 350.000',
      jamBuka: '09:00',
      jamTutup: '20:00',
      foto: '/uploads/umkm/busana-muslim.jpg',
      latitude: -6.9145,
      longitude: 107.6161,
      isAktif: true
    },

    // Kerajinan
    {
      nama: 'Kerajinan Bambu Pak Agus',
      slug: 'kerajinan-bambu-pak-agus',
      pemilik: 'Agus Priyanto',
      deskripsi: 'Produsen kerajinan bambu seperti anyaman, keranjang, hiasan dinding, dan furniture bambu. Produk ramah lingkungan dan awet.',
      kategori: 'Kerajinan',
      alamat: 'Jl. Veteran No. 18, RT 02/RW 03',
      kontak: '081234567909',
      produk: 'Keranjang Bambu, Anyaman, Hiasan Dinding, Kursi Bambu, Lampu Hias',
      harga: '30.000 - 500.000',
      jamBuka: '08:00',
      jamTutup: '16:00',
      foto: '/uploads/umkm/kerajinan-bambu.jpg',
      latitude: -6.9215,
      longitude: 107.6231,
      isAktif: true
    },
    {
      nama: 'Gerabah Bu Ratna',
      slug: 'gerabah-bu-ratna',
      pemilik: 'Ratna Sari',
      deskripsi: 'Pengrajin gerabah dan keramik tradisional. Produk meliputi pot bunga, vas, guci, dan peralatan dapur dari tanah liat berkualitas.',
      kategori: 'Kerajinan',
      alamat: 'Kampung Adat, RT 01/RW 01',
      kontak: '081234567910',
      produk: 'Pot Gerabah, Vas Bunga, Guci, Cobek, Kendi',
      harga: '20.000 - 300.000',
      jamBuka: '07:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/gerabah.jpg',
      latitude: -6.9135,
      longitude: 107.6151,
      isAktif: true
    },

    // Pertanian
    {
      nama: 'Sayur Organik Pak Eko',
      slug: 'sayur-organik-pak-eko',
      pemilik: 'Eko Prasetyo',
      deskripsi: 'Petani sayuran organik tanpa pestisida kimia. Hasil panen segar setiap hari meliputi berbagai jenis sayuran hijau dan buah lokal.',
      kategori: 'Pertanian',
      alamat: 'Kebun Dusun II',
      kontak: '081234567912',
      produk: 'Kangkung, Bayam, Sawi, Tomat, Cabai, Terong',
      harga: '5.000 - 20.000 per ikat/kg',
      jamBuka: '06:00',
      jamTutup: '12:00',
      foto: '/uploads/umkm/sayur-organik.jpg',
      latitude: -6.9225,
      longitude: 107.6241,
      isAktif: true
    },
    {
      nama: 'Madu Hutan Bu Maya',
      slug: 'madu-hutan-bu-maya',
      pemilik: 'Maya Kusuma',
      deskripsi: 'Madu murni hasil hutan yang dikumpulkan langsung dari sarang lebah liar. Tanpa campuran gula, khasiat untuk kesehatan sangat baik.',
      kategori: 'Pertanian',
      alamat: 'Jl. Raya Desa Km 5, RT 03/RW 03',
      kontak: '081234567913',
      produk: 'Madu Hutan Murni, Madu Royal Jelly, Propolis, Bee Pollen',
      harga: '75.000 - 250.000 per botol',
      jamBuka: '08:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/madu-hutan.jpg',
      latitude: -6.9125,
      longitude: 107.6141,
      isAktif: true
    },

    // Jasa
    {
      nama: 'Salon Cantik Indah',
      slug: 'salon-cantik-indah',
      pemilik: 'Indah Permata',
      deskripsi: 'Salon kecantikan untuk wanita dan pria. Layanan potong rambut, cat rambut, creambath, facial, dan make up. Harga terjangkau dengan hasil memuaskan.',
      kategori: 'Jasa',
      alamat: 'Jl. Pemuda No. 45, RT 01/RW 02',
      kontak: '081234567915',
      produk: 'Potong Rambut, Cat Rambut, Creambath, Facial, Make Up, Spa',
      harga: '25.000 - 300.000',
      jamBuka: '09:00',
      jamTutup: '20:00',
      foto: '/uploads/umkm/salon-cantik.jpg',
      latitude: -6.9235,
      longitude: 107.6251,
      isAktif: true
    },
    {
      nama: 'Bengkel Motor Pak Tono',
      slug: 'bengkel-motor-pak-tono',
      pemilik: 'Tono Suprapto',
      deskripsi: 'Bengkel motor untuk semua merk dengan mekanik berpengalaman. Servis rutin, ganti oli, spare part original dan KW. Harga jujur dan garansi.',
      kategori: 'Jasa',
      alamat: 'Jl. Raya Desa Km 1, RT 04/RW 01',
      kontak: '081234567916',
      produk: 'Servis Motor, Ganti Oli, Tune Up, Spare Part, Modifikasi',
      harga: '25.000 - 500.000',
      jamBuka: '08:00',
      jamTutup: '18:00',
      foto: '/uploads/umkm/bengkel-motor.jpg',
      latitude: -6.9115,
      longitude: 107.6131,
      isAktif: true
    },
    {
      nama: 'Laundry Express Mbak Yanti',
      slug: 'laundry-express-mbak-yanti',
      pemilik: 'Yanti Kusuma',
      deskripsi: 'Jasa laundry kiloan dan satuan dengan mesin cuci modern. Layanan cepat, bersih, wangi, dan rapi. Free antar jemput untuk area desa.',
      kategori: 'Jasa',
      alamat: 'Jl. Merdeka No. 28, RT 03/RW 02',
      kontak: '081234567917',
      produk: 'Cuci Kering, Cuci Setrika, Setrika Saja, Cuci Sepatu, Cuci Karpet',
      harga: '5.000 - 15.000 per kg',
      jamBuka: '07:00',
      jamTutup: '20:00',
      foto: '/uploads/umkm/laundry.jpg',
      latitude: -6.9245,
      longitude: 107.6261,
      isAktif: true
    }
  ];

  const now = new Date();
  for (let i = 0; i < umkmData.length; i++) {
    const daysAgo = Math.floor(Math.random() * 365); // Random dalam 1 tahun
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.uMKM.create({
      data: {
        ...umkmData[i],
        createdAt: createdAt,
        updatedAt: createdAt
      }
    });
  }

  console.log(`✅ ${umkmData.length} UMKM created`);
  return prisma.uMKM.findMany();
}

module.exports = { seedUMKM };