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
      isAktif: true
    },
    {
      nama: 'Rajut Kreatif Mba Lilis',
      slug: 'rajut-kreatif-mba-lilis',
      pemilik: 'Lilis Suryani',
      deskripsi: 'Produk rajutan handmade seperti tas, dompet, topi, dan aksesoris. Bisa custom design sesuai pesanan. Cocok untuk hadiah dan koleksi pribadi.',
      kategori: 'Fashion',
      alamat: 'Jl. Pemuda No. 20, RT 03/RW 01',
      kontak: '081234567908',
      produk: 'Tas Rajut, Dompet, Topi, Bros, Gantungan Kunci',
      harga: '25.000 - 150.000',
      jamBuka: '08:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/rajut-kreatif.jpg',
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
      isAktif: true
    },
    {
      nama: 'Ukiran Kayu Pak Hendra',
      slug: 'ukiran-kayu-pak-hendra',
      pemilik: 'Hendra Wijaya',
      deskripsi: 'Pengrajin ukiran kayu Jepara dengan motif tradisional dan modern. Menerima pesanan custom untuk hiasan rumah, furniture, dan souvenir.',
      kategori: 'Kerajinan',
      alamat: 'Jl. Diponegoro No. 30, RT 04/RW 02',
      kontak: '081234567911',
      produk: 'Ukiran Dinding, Relief, Patung Kayu, Furniture Ukir, Miniatur',
      harga: '100.000 - 5.000.000',
      jamBuka: '08:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/ukiran-kayu.jpg',
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
      isAktif: true
    },
    {
      nama: 'Bibit Tanaman Pak Dedi',
      slug: 'bibit-tanaman-pak-dedi',
      pemilik: 'Dedi Kurniawan',
      deskripsi: 'Penjual bibit tanaman hias, tanaman obat, dan tanaman buah. Bibit berkualitas dan siap tanam dengan harga bersahabat.',
      kategori: 'Pertanian',
      alamat: 'Jl. Tani No. 10, RT 02/RW 02',
      kontak: '081234567914',
      produk: 'Bibit Buah, Bibit Tanaman Hias, Bibit Sayuran, Tanaman Obat',
      harga: '10.000 - 500.000 per pot',
      jamBuka: '07:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/bibit-tanaman.jpg',
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
      isAktif: true
    },
    {
      nama: 'Fotocopy & Percetakan Fajar',
      slug: 'fotocopy-percetakan-fajar',
      pemilik: 'Fajar Ramadhan',
      deskripsi: 'Jasa fotocopy, print, scan, laminating, jilid, dan cetak banner. Harga murah dan cepat. Melayani mahasiswa, pelajar, dan umum.',
      kategori: 'Jasa',
      alamat: 'Dekat SDN 1, RT 01/RW 01',
      kontak: '081234567918',
      produk: 'Fotocopy, Print, Scan, Laminating, Jilid, Cetak Banner',
      harga: '200 - 50.000',
      jamBuka: '07:00',
      jamTutup: '21:00',
      foto: '/uploads/umkm/fotocopy.jpg',
      isAktif: true
    },

    // Lainnya
    {
      nama: 'Toko Kelontong Pak Wahyu',
      slug: 'toko-kelontong-pak-wahyu',
      pemilik: 'Wahyu Hidayat',
      deskripsi: 'Toko kelontong lengkap dengan kebutuhan sehari-hari. Sembako, snack, minuman, alat tulis, dan keperluan rumah tangga tersedia dengan harga pas.',
      kategori: 'Retail',
      alamat: 'Jl. Pasar No. 3, RT 02/RW 01',
      kontak: '081234567919',
      produk: 'Sembako, Snack, Minuman, Alat Tulis, Perlengkapan Rumah',
      harga: '500 - 200.000',
      jamBuka: '06:00',
      jamTutup: '22:00',
      foto: '/uploads/umkm/toko-kelontong.jpg',
      isAktif: true
    },
    {
      nama: 'Depot Air Minum Berkah',
      slug: 'depot-air-minum-berkah',
      pemilik: 'Rizki Ramadhan',
      deskripsi: 'Depot air minum isi ulang dengan sistem penyaringan 7 tahap. Air bersih, sehat, dan harga ekonomis. Galon tersedia untuk pembelian dan sewa.',
      kategori: 'Retail',
      alamat: 'Jl. Sudirman No. 50, RT 04/RW 02',
      kontak: '081234567920',
      produk: 'Air Minum Isi Ulang, Galon, Air Mineral Kemasan',
      harga: '3.000 - 20.000',
      jamBuka: '06:00',
      jamTutup: '20:00',
      foto: '/uploads/umkm/depot-air.jpg',
      isAktif: true
    },
    {
      nama: 'Toko Bangunan Maju Jaya',
      slug: 'toko-bangunan-maju-jaya',
      pemilik: 'Bambang Hermawan',
      deskripsi: 'Toko material bangunan lengkap. Semen, pasir, batu bata, cat, pipa, dan kebutuhan konstruksi lainnya. Harga grosir dan melayani pengiriman.',
      kategori: 'Retail',
      alamat: 'Jl. Industri No. 15, RT 03/RW 03',
      kontak: '081234567921',
      produk: 'Semen, Pasir, Batu Bata, Cat, Pipa, Genteng, Keramik',
      harga: '5.000 - 5.000.000',
      jamBuka: '07:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/toko-bangunan.jpg',
      isAktif: true
    },
    {
      nama: 'Warnet & Game Center',
      slug: 'warnet-game-center',
      pemilik: 'Andi Setiawan',
      deskripsi: 'Warnet dengan koneksi internet cepat dan game center PS4/PS5. Tempat nyaman, AC, dan harga mahasiswa. Cocok untuk kerja, gaming, dan nongkrong.',
      kategori: 'Jasa',
      alamat: 'Jl. Pemuda No. 60, RT 02/RW 02',
      kontak: '081234567922',
      produk: 'Internet, Game PS4/PS5, Print, Scan, Rental Laptop',
      harga: '3.000 - 15.000 per jam',
      jamBuka: '08:00',
      jamTutup: '23:00',
      foto: '/uploads/umkm/warnet.jpg',
      isAktif: true
    },
    {
      nama: 'Rental Mobil Desa',
      slug: 'rental-mobil-desa',
      pemilik: 'Hasan Basri',
      deskripsi: 'Jasa rental mobil harian dan bulanan. Tersedia mobil keluarga, mini bus, dan pick up. Dengan atau tanpa driver, unit terawat dan harga bersaing.',
      kategori: 'Jasa',
      alamat: 'Jl. Raya Desa Km 2, RT 01/RW 03',
      kontak: '081234567923',
      produk: 'Rental Avanza, Innova, Elf, Pick Up, Hiace',
      harga: '300.000 - 1.500.000 per hari',
      jamBuka: '00:00',
      jamTutup: '23:59',
      foto: '/uploads/umkm/rental-mobil.jpg',
      isAktif: true
    },
    {
      nama: 'Penjahit Ibu Sri',
      slug: 'penjahit-ibu-sri',
      pemilik: 'Sri Wahyuni',
      deskripsi: 'Jasa jahit baju, reparasi pakaian, dan modifikasi. Hasil rapi dan harga terjangkau. Melayani jahit kebaya, baju pesta, seragam, dan pakaian sehari-hari.',
      kategori: 'Jasa',
      alamat: 'Jl. Kartini No. 22, RT 03/RW 01',
      kontak: '081234567924',
      produk: 'Jahit Baju, Reparasi, Modifikasi, Kebaya, Baju Pesta',
      harga: '50.000 - 500.000',
      jamBuka: '08:00',
      jamTutup: '17:00',
      foto: '/uploads/umkm/penjahit.jpg',
      isAktif: true
    },
    {
      nama: 'Toko Bunga Segar',
      slug: 'toko-bunga-segar',
      pemilik: 'Dian Pramudya',
      deskripsi: 'Toko bunga segar untuk berbagai keperluan. Rangkaian bunga papan, hand bouquet, bunga meja, dan dekorasi acara. Pengiriman gratis area desa.',
      kategori: 'Retail',
      alamat: 'Jl. Pasar No. 8, RT 02/RW 01',
      kontak: '081234567925',
      produk: 'Bunga Papan, Hand Bouquet, Bunga Meja, Dekorasi, Buket Wisuda',
      harga: '50.000 - 1.500.000',
      jamBuka: '07:00',
      jamTutup: '20:00',
      foto: '/uploads/umkm/toko-bunga.jpg',
      isAktif: true
    },
    {
      nama: 'Es Campur Mantap',
      slug: 'es-campur-mantap',
      pemilik: 'Lina Kusuma',
      deskripsi: 'Penjual es campur, es buah, dan es krim dengan topping lengkap. Segar, manis, dan harga murah. Tempat favorit warga di siang hari.',
      kategori: 'Kuliner',
      alamat: 'Depan Pasar Desa',
      kontak: '081234567926',
      produk: 'Es Campur, Es Buah, Es Krim, Es Cincau, Es Kelapa',
      harga: '8.000 - 20.000',
      jamBuka: '10:00',
      jamTutup: '20:00',
      foto: '/uploads/umkm/es-campur.jpg',
      isAktif: true
    },
    {
      nama: 'Kue Basah Bu Ani',
      slug: 'kue-basah-bu-ani',
      pemilik: 'Ani Rahayu',
      deskripsi: 'Produsen kue basah tradisional seperti lemper, risoles, pastel, dan kue lapis. Enak, fresh, dan cocok untuk arisan atau camilan.',
      kategori: 'Kuliner',
      alamat: 'Jl. Merdeka No. 35, RT 01/RW 02',
      kontak: '081234567927',
      produk: 'Lemper, Risoles, Pastel, Kue Lapis, Bolu, Brownies',
      harga: '2.000 - 25.000 per pcs',
      jamBuka: '06:00',
      jamTutup: '18:00',
      foto: '/uploads/umkm/kue-basah.jpg',
      isAktif: true
    },
    {
      nama: 'Ternak Lele Pak Joko',
      slug: 'ternak-lele-pak-joko',
      pemilik: 'Joko Widodo',
      deskripsi: 'Peternak lele konsumsi dan bibit. Ikan lele segar setiap hari, bisa request ukuran. Harga grosir untuk penjual dan warung makan.',
      kategori: 'Peternakan',
      alamat: 'Kolam Dusun II',
      kontak: '081234567928',
      produk: 'Lele Konsumsi, Bibit Lele, Lele Goreng Bumbu',
      harga: '18.000 - 25.000 per kg',
      jamBuka: '06:00',
      jamTutup: '18:00',
      foto: '/uploads/umkm/ternak-lele.jpg',
      isAktif: true
    },
    {
      nama: 'Susu Sapi Murni Bu Putri',
      slug: 'susu-sapi-murni-bu-putri',
      pemilik: 'Putri Ayu',
      deskripsi: 'Susu sapi murni tanpa pengawet dari peternakan sendiri. Fresh setiap pagi, kaya nutrisi dan cocok untuk segala usia. Tersedia susu pasteurisasi.',
      kategori: 'Peternakan',
      alamat: 'Peternakan Dusun III',
      kontak: '081234567929',
      produk: 'Susu Sapi Murni, Susu Pasteurisasi, Yogurt, Keju',
      harga: '10.000 - 25.000 per liter',
      jamBuka: '05:00',
      jamTutup: '10:00',
      foto: '/uploads/umkm/susu-sapi.jpg',
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
