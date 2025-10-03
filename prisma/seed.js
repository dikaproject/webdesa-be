const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    console.log('🧹 Clearing existing data...');
    await prisma.transaction.deleteMany();
    await prisma.berita.deleteMany();
    await prisma.programPembangunan.deleteMany();
    await prisma.uMKM.deleteMany();
    await prisma.wisataDesa.deleteMany();
    await prisma.laporan.deleteMany();
    await prisma.profilDesa.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Existing data cleared');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@desa.id',
        password: adminPassword,
        name: 'Administrator Desa',
        role: 'ADMIN',
        noTelp: '081234567890',
        alamat: 'Kantor Desa Suka Maju'
      }
    });

    const wargaPassword = await bcrypt.hash('warga123', 10);
    const warga1 = await prisma.user.create({
      data: {
        email: 'budi@gmail.com',
        password: wargaPassword,
        name: 'Budi Santoso',
        role: 'WARGA',
        noTelp: '081234567891',
        alamat: 'Jl. Merdeka No. 10, RT 01/RW 02'
      }
    });

    const warga2 = await prisma.user.create({
      data: {
        email: 'siti@gmail.com',
        password: wargaPassword,
        name: 'Siti Nurhaliza',
        role: 'WARGA',
        noTelp: '081234567892',
        alamat: 'Jl. Pemuda No. 15, RT 02/RW 03'
      }
    });

    const warga3 = await prisma.user.create({
      data: {
        email: 'ahmad@gmail.com',
        password: wargaPassword,
        name: 'Ahmad Wijaya',
        role: 'WARGA',
        noTelp: '081234567893',
        alamat: 'Jl. Pancasila No. 8, RT 03/RW 01'
      }
    });

    const warga4 = await prisma.user.create({
      data: {
        email: 'fatimah@gmail.com',
        password: wargaPassword,
        name: 'Fatimah Zahra',
        role: 'WARGA',
        noTelp: '081234567894',
        alamat: 'Jl. Diponegoro No. 22, RT 02/RW 01'
      }
    });

    const warga5 = await prisma.user.create({
      data: {
        email: 'hasan@gmail.com',
        password: wargaPassword,
        name: 'Hasan Basri',
        role: 'WARGA',
        noTelp: '081234567895',
        alamat: 'Jl. Sudirman No. 5, RT 01/RW 03'
      }
    });

    const visitorPassword = await bcrypt.hash('visitor123', 10);
    const visitor1 = await prisma.user.create({
      data: {
        email: 'tourist1@gmail.com',
        password: visitorPassword,
        name: 'Rina Setiawan',
        role: 'VISITOR',
        noTelp: '081234567896'
      }
    });

    const visitor2 = await prisma.user.create({
      data: {
        email: 'visitor2@gmail.com',
        password: visitorPassword,
        name: 'David Chen',
        role: 'VISITOR',
        noTelp: '081234567897'
      }
    });

    console.log('✅ Users created');

    await prisma.profilDesa.create({
      data: {
        namaDesa: 'Desa Suka Maju',
        kecamatan: 'Kecamatan Sejahtera',
        kabupaten: 'Kabupaten Makmur',
        provinsi: 'Jawa Barat',
        kodePos: '40123',
        luasWilayah: 15.5,
        visiMisi: 'Visi: Mewujudkan Desa Suka Maju yang mandiri, sejahtera, dan berkelanjutan.\n\nMisi:\n1. Meningkatkan kualitas sumber daya manusia\n2. Mengembangkan ekonomi kreatif dan UMKM\n3. Membangun infrastruktur yang memadai\n4. Melestarikan lingkungan hidup',
        sejarah: 'Desa Suka Maju didirikan pada tahun 1945 oleh para pejuang kemerdekaan. Nama "Suka Maju" diambil dari semangat masyarakat yang selalu ingin berkembang dan maju. Seiring berjalannya waktu, desa ini berkembang menjadi salah satu desa percontohan di kabupaten.',
        geografis: 'Desa Suka Maju terletak di dataran tinggi dengan ketinggian 800-1200 meter di atas permukaan laut. Dikelilingi oleh perbukitan hijau dan sumber mata air alami.',
        struktur: 'Kepala Desa: Pak Suharto\nSekretaris Desa: Bu Marlina\nKaur Pembangunan: Pak Joko\nKaur Kesra: Bu Aminah\nKaur Umum: Pak Budi',
        kontak: '022-1234567',
        email: 'info@desasukamaju.id',
        website: 'https://desasukamaju.id',
        foto: '/uploads/profil-desa.jpg'
      }
    });

    console.log('✅ Profil Desa created');

    await prisma.laporan.createMany({
      data: [
        {
          judul: 'Jalan Rusak di RT 01',
          deskripsi: 'Jalan di depan rumah pak RT mengalami kerusakan parah akibat hujan deras minggu lalu. Banyak lubang yang membahayakan pengendara motor.',
          kategori: 'INFRASTRUKTUR',
          status: 'PENDING',
          lokasi: 'Jl. Merdeka RT 01/RW 02',
          foto: '/uploads/laporan1.jpg',
          userId: warga1.id
        },
        {
          judul: 'Lampu Jalan Mati',
          deskripsi: 'Lampu jalan di sepanjang Jl. Pemuda sudah mati sejak 3 hari yang lalu. Kondisi ini membuat jalan gelap dan rawan kejahatan.',
          kategori: 'INFRASTRUKTUR',
          status: 'PROSES',
          lokasi: 'Jl. Pemuda',
          tanggapan: 'Laporan telah diterima dan sedang diproses oleh dinas terkait.',
          userId: warga2.id
        },
        {
          judul: 'Sampah Menumpuk di TPS',
          deskripsi: 'Tempat pembuangan sampah sementara di RT 03 sudah penuh dan tidak diangkut selama seminggu.',
          kategori: 'LINGKUNGAN',
          status: 'SELESAI',
          lokasi: 'TPS RT 03/RW 01',
          tanggapan: 'Sampah telah diangkut dan jadwal pengangkutan akan diperbaiki.',
          userId: warga3.id
        },
        {
          judul: 'Puskesmas Tutup Sementara',
          deskripsi: 'Puskesmas desa tutup sementara karena dokter sedang cuti. Warga kesulitan mendapat pelayanan kesehatan.',
          kategori: 'KESEHATAN',
          status: 'PROSES',
          lokasi: 'Puskesmas Desa',
          tanggapan: 'Sedang mencari dokter pengganti sementara.',
          userId: warga4.id
        },
        {
          judul: 'Sekolah Butuh Renovasi',
          deskripsi: 'Atap sekolah dasar bocor ketika hujan. Siswa terpaksa pindah ruangan saat hujan deras.',
          kategori: 'PENDIDIKAN',
          status: 'PENDING',
          lokasi: 'SD Negeri Suka Maju',
          userId: warga5.id
        }
      ]
    });

    console.log('✅ Laporan created');

    const wisata1 = await prisma.wisataDesa.create({
      data: {
        nama: 'Air Terjun Pelangi',
        deskripsi: 'Air terjun indah dengan ketinggian 25 meter yang memberikan pemandangan spektakuler. Pada pagi hari sering terlihat pelangi di sekitar air terjun.',
        lokasi: 'Bukit Hijau, 2 km dari pusat desa',
        kategori: 'Alam',
        harga: 10000,
        jamBuka: '08:00',
        jamTutup: '17:00',
        kontak: '081234567800',
        foto: '/uploads/air-terjun.jpg',
        rating: 4.5
      }
    });

    const wisata2 = await prisma.wisataDesa.create({
      data: {
        nama: 'Kebun Strawberry Suka Maju',
        deskripsi: 'Kebun strawberry organik dengan konsep agrowisata. Pengunjung dapat memetik langsung strawberry segar dan belajar cara bercocok tanam.',
        lokasi: 'Blok Pertanian, 1.5 km dari kantor desa',
        kategori: 'Agrowisata',
        harga: 25000,
        jamBuka: '07:00',
        jamTutup: '16:00',
        kontak: '081234567801',
        foto: '/uploads/kebun-strawberry.jpg',
        rating: 4.2
      }
    });

    const wisata3 = await prisma.wisataDesa.create({
      data: {
        nama: 'Rumah Adat Betawi',
        deskripsi: 'Museum rumah adat tradisional yang masih terawat dengan baik. Menampilkan koleksi peralatan rumah tangga dan budaya tradisional.',
        lokasi: 'Kampung Budaya RT 05',
        kategori: 'Budaya',
        harga: 5000,
        jamBuka: '09:00',
        jamTutup: '15:00',
        kontak: '081234567802',
        foto: '/uploads/rumah-adat.jpg',
        rating: 4.0
      }
    });

    const wisata4 = await prisma.wisataDesa.create({
      data: {
        nama: 'Hiking Trail Bukit Sunrise',
        deskripsi: 'Jalur pendakian menuju puncak bukit untuk melihat sunrise. Pemandangan sangat indah dan cocok untuk fotografi.',
        lokasi: 'Bukit Sunrise, 3 km dari desa',
        kategori: 'Alam',
        harga: 15000,
        jamBuka: '05:00',
        jamTutup: '18:00',
        kontak: '081234567803',
        foto: '/uploads/hiking-trail.jpg',
        rating: 4.3
      }
    });

    console.log('✅ Wisata Desa created');

    await prisma.transaction.createMany({
      data: [
        {
          userId: visitor1.id,
          wisataId: wisata1.id,
          jumlahTiket: 2,
          totalHarga: 20000,
          tanggalKunjungan: new Date('2025-10-15'),
          namaLengkap: 'Rina Setiawan',
          noTelp: '081234567896',
          status: 'PAID',
          buktiPembayaran: '/uploads/bukti-bayar-1.jpg'
        },
        {
          userId: visitor2.id,
          wisataId: wisata2.id,
          jumlahTiket: 4,
          totalHarga: 100000,
          tanggalKunjungan: new Date('2025-10-20'),
          namaLengkap: 'David Chen',
          noTelp: '081234567897',
          status: 'PAID',
          buktiPembayaran: '/uploads/bukti-bayar-2.jpg'
        },
        {
          userId: warga1.id,
          wisataId: wisata3.id,
          jumlahTiket: 3,
          totalHarga: 15000,
          tanggalKunjungan: new Date('2025-10-18'),
          namaLengkap: 'Budi Santoso',
          noTelp: '081234567891',
          status: 'PENDING'
        },
        {
          userId: visitor1.id,
          wisataId: wisata4.id,
          jumlahTiket: 2,
          totalHarga: 30000,
          tanggalKunjungan: new Date('2025-10-25'),
          namaLengkap: 'Rina Setiawan',
          noTelp: '081234567896',
          status: 'PENDING'
        },
        {
          userId: warga2.id,
          wisataId: wisata1.id,
          jumlahTiket: 5,
          totalHarga: 50000,
          tanggalKunjungan: new Date('2025-10-12'),
          namaLengkap: 'Siti Nurhaliza',
          noTelp: '081234567892',
          status: 'CANCELLED'
        }
      ]
    });

    console.log('✅ Transactions created');

    await prisma.uMKM.createMany({
      data: [
        {
          nama: 'Keripik Singkong Bu Yani',
          pemilik: 'Yani Suhartini',
          deskripsi: 'Usaha keripik singkong dengan berbagai varian rasa. Menggunakan singkong lokal berkualitas tinggi dan bumbu rahasia turun temurun.',
          kategori: 'Makanan & Minuman',
          alamat: 'Jl. Mawar No. 12 RT 02/RW 01',
          kontak: '081234567810',
          produk: 'Keripik singkong original, pedas, balado, keju',
          harga: 'Rp 15.000 - Rp 25.000',
          foto: '/uploads/keripik-singkong.jpg',
          jamBuka: '08:00',
          jamTutup: '20:00'
        },
        {
          nama: 'Tas Rajut Ibu Mega',
          pemilik: 'Mega Sari',
          deskripsi: 'Kerajinan tas rajut handmade dengan desain unik dan kualitas premium. Menerima pesanan custom sesuai keinginan pelanggan.',
          kategori: 'Kerajinan',
          alamat: 'Jl. Melati No. 7 RT 01/RW 02',
          kontak: '081234567811',
          produk: 'Tas rajut, dompet rajut, topi rajut',
          harga: 'Rp 50.000 - Rp 200.000',
          foto: '/uploads/tas-rajut.jpg',
          jamBuka: '09:00',
          jamTutup: '17:00'
        },
        {
          nama: 'Warung Nasi Gudeg Pak Tono',
          pemilik: 'Tono Supriyanto',
          deskripsi: 'Warung gudeg dengan cita rasa autentik Yogyakarta. Menyajikan gudeg dengan nangka muda pilihan dan bumbu yang khas.',
          kategori: 'Makanan & Minuman',
          alamat: 'Jl. Raya Desa No. 45',
          kontak: '081234567812',
          produk: 'Nasi gudeg, ayam bakar, tahu tempe bacem',
          harga: 'Rp 12.000 - Rp 25.000',
          foto: '/uploads/gudeg.jpg',
          jamBuka: '10:00',
          jamTutup: '21:00'
        },
        {
          nama: 'Kopi Robusta Suka Maju',
          pemilik: 'Joko Santoso',
          deskripsi: 'Kopi robusta premium hasil kebun sendiri dengan proses roasting tradisional. Cita rasa khas pegunungan.',
          kategori: 'Makanan & Minuman',
          alamat: 'Jl. Kopi No. 3 RT 01/RW 01',
          kontak: '081234567813',
          produk: 'Kopi bubuk, kopi biji, kopi kemasan',
          harga: 'Rp 25.000 - Rp 75.000',
          foto: '/uploads/kopi-robusta.jpg',
          jamBuka: '07:00',
          jamTutup: '19:00'
        },
        {
          nama: 'Madu Hutan Pak Heri',
          pemilik: 'Heri Gunawan',
          deskripsi: 'Madu murni hasil ternak lebah hutan. Tanpa campuran gula atau bahan kimia. Dipanen langsung dari hutan desa.',
          kategori: 'Makanan & Minuman',
          alamat: 'Jl. Hutan No. 8 RT 03/RW 02',
          kontak: '081234567814',
          produk: 'Madu murni, royal jelly, propolis',
          harga: 'Rp 50.000 - Rp 150.000',
          foto: '/uploads/madu-hutan.jpg',
          jamBuka: '08:00',
          jamTutup: '18:00'
        }
      ]
    });

    console.log('✅ UMKM created');

    await prisma.programPembangunan.createMany({
      data: [
        {
          nama: 'Pembangunan Jalan Desa',
          deskripsi: 'Program pembangunan jalan beraspal sepanjang 2 km untuk menghubungkan pusat desa dengan area pertanian. Diharapkan dapat meningkatkan akses transportasi bagi petani.',
          kategori: 'Infrastruktur',
          anggaran: 500000000,
          sumberDana: 'Dana Desa + APBD Kabupaten',
          timeline: 'Januari 2025 - Juni 2025',
          status: 'PELAKSANAAN',
          progress: 65,
          foto: '/uploads/pembangunan-jalan.jpg',
          penanggungJawab: 'Dinas Pekerjaan Umum'
        },
        {
          nama: 'Pembangunan Posyandu',
          deskripsi: 'Pembangunan gedung posyandu baru dengan fasilitas lengkap untuk meningkatkan pelayanan kesehatan masyarakat, terutama ibu dan anak.',
          kategori: 'Kesehatan',
          anggaran: 150000000,
          sumberDana: 'Dana Desa',
          timeline: 'Maret 2025 - Agustus 2025',
          status: 'PELAKSANAAN',
          progress: 30,
          foto: '/uploads/posyandu.jpg',
          penanggungJawab: 'Dinas Kesehatan'
        },
        {
          nama: 'Program Pelatihan UMKM',
          deskripsi: 'Program pelatihan keterampilan dan manajemen usaha untuk pelaku UMKM desa agar dapat mengembangkan usaha dan meningkatkan pendapatan.',
          kategori: 'Ekonomi',
          anggaran: 75000000,
          sumberDana: 'Dana Desa + CSR',
          timeline: 'April 2025 - Oktober 2025',
          status: 'PERENCANAAN',
          progress: 10,
          penanggungJawab: 'Dinas Koperasi dan UMKM'
        },
        {
          nama: 'Sistem Irigasi Modern',
          deskripsi: 'Pembangunan sistem irigasi tetes untuk area pertanian desa. Meningkatkan efisiensi penggunaan air dan produktivitas pertanian.',
          kategori: 'Pertanian',
          anggaran: 200000000,
          sumberDana: 'Dana Desa + Grant International',
          timeline: 'Juli 2025 - Desember 2025',
          status: 'PERENCANAAN',
          progress: 5,
          penanggungJawab: 'Dinas Pertanian'
        }
      ]
    });

    console.log('✅ Program Pembangunan created');

    await prisma.berita.createMany({
      data: [
        {
          judul: 'Desa Suka Maju Raih Penghargaan Desa Terbaik',
          konten: 'Desa Suka Maju berhasil meraih penghargaan sebagai Desa Terbaik tingkat kabupaten dalam bidang pembangunan infrastruktur dan pemberdayaan masyarakat. Penghargaan ini diberikan berdasarkan penilaian komprehensif terhadap kemajuan desa dalam berbagai aspek pembangunan.',
          kategori: 'Prestasi',
          foto: '/uploads/penghargaan.jpg',
          author: 'Admin Desa',
          isPublish: true
        },
        {
          judul: 'Festival Strawberry Perdana Desa Suka Maju',
          konten: 'Desa Suka Maju akan menggelar Festival Strawberry perdana pada bulan depan. Festival ini merupakan bagian dari program promosi wisata desa dan pemberdayaan petani strawberry lokal.',
          kategori: 'Event',
          foto: '/uploads/festival-strawberry.jpg',
          author: 'Admin Desa',
          isPublish: true
        },
        {
          judul: 'Pembukaan Pendaftaran Pelatihan Komputer Gratis',
          konten: 'Pemerintah desa membuka pendaftaran pelatihan komputer gratis untuk masyarakat desa, khususnya generasi muda dan pelaku UMKM. Pelatihan meliputi Microsoft Office dan pemasaran digital.',
          kategori: 'Pengumuman',
          author: 'Admin Desa',
          isPublish: false
        },
        {
          judul: 'Gotong Royong Bersih Desa Setiap Sabtu',
          konten: 'Mulai bulan ini, setiap hari Sabtu pagi akan diadakan gotong royong bersih desa. Seluruh warga diharapkan berpartisipasi untuk menjaga kebersihan lingkungan.',
          kategori: 'Kegiatan',
          author: 'Admin Desa',
          isPublish: true
        },
        {
          judul: 'Peresmian Website Resmi Desa',
          konten: 'Website resmi Desa Suka Maju telah diluncurkan untuk memberikan informasi terkini kepada masyarakat. Website dapat diakses di https://desasukamaju.id',
          kategori: 'Teknologi',
          author: 'Admin Desa',
          isPublish: true
        }
      ]
    });

    console.log('✅ Berita created');

    console.log('🎉 Seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- 1 Admin: admin@desa.id (password: admin123)');
    console.log('- 5 Warga: budi@gmail.com, siti@gmail.com, ahmad@gmail.com, fatimah@gmail.com, hasan@gmail.com (password: warga123)');
    console.log('- 2 Visitor: tourist1@gmail.com, visitor2@gmail.com (password: visitor123)');
    console.log('- 1 Profil Desa');
    console.log('- 5 Laporan');
    console.log('- 4 Wisata Desa');
    console.log('- 5 Transactions (2 PAID, 2 PENDING, 1 CANCELLED)');
    console.log('- 5 UMKM');
    console.log('- 4 Program Pembangunan');
    console.log('- 5 Berita');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });