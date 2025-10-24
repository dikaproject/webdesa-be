const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProgram() {
  console.log('🌱 Seeding Program Pembangunan...');

  const programData = [
    {
      nama: 'Perbaikan Jalan Desa',
      deskripsi: 'Program perbaikan jalan utama desa sepanjang 5 km yang rusak akibat hujan dan beban kendaraan. Meliputi pengerasan jalan, pembuatan drainase, dan pemasangan paving block.',
      kategori: 'Infrastruktur',
      anggaran: 500000000,
      sumberDana: 'APBD Kabupaten & Dana Desa',
      timeline: '6 bulan (Januari - Juni 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 65,
      penanggungJawab: 'Dinas Pekerjaan Umum',
      foto: '/uploads/program/jalan-desa.jpg'
    },
    {
      nama: 'Pembangunan Posyandu',
      deskripsi: 'Membangun gedung posyandu baru yang lebih luas dan nyaman untuk pelayanan kesehatan ibu dan anak. Dilengkapi dengan ruang tunggu, ruang pemeriksaan, dan gudang obat.',
      kategori: 'Kesehatan',
      anggaran: 150000000,
      sumberDana: 'Dana Desa & Bantuan Provinsi',
      timeline: '4 bulan (Februari - Mei 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 80,
      penanggungJawab: 'Dinas Kesehatan',
      foto: '/uploads/program/posyandu.jpg'
    },
    {
      nama: 'Renovasi Sekolah Dasar',
      deskripsi: 'Renovasi total SDN 1 Suka Maju meliputi perbaikan atap, cat tembok, lantai, dan fasilitas sanitasi. Menambah ruang kelas baru dan perpustakaan.',
      kategori: 'Pendidikan',
      anggaran: 300000000,
      sumberDana: 'APBN & Dana BOS',
      timeline: '5 bulan (Maret - Juli 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 45,
      penanggungJawab: 'Dinas Pendidikan',
      foto: '/uploads/program/renovasi-sekolah.jpg'
    },
    {
      nama: 'Instalasi Air Bersih',
      deskripsi: 'Pembangunan sistem distribusi air bersih dari sumber mata air ke rumah warga melalui pipa distribusi. Memasang tower air dan meteran untuk 150 rumah.',
      kategori: 'Infrastruktur',
      anggaran: 400000000,
      sumberDana: 'Dana Desa & CSR',
      timeline: '8 bulan (Januari - Agustus 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 55,
      penanggungJawab: 'PDAM & Pemerintah Desa',
      foto: '/uploads/program/air-bersih.jpg'
    },
    {
      nama: 'Pembangunan Pasar Desa',
      deskripsi: 'Membangun pasar desa modern dengan 50 kios pedagang, area parkir luas, toilet umum, dan mushola. Meningkatkan ekonomi warga dan kenyamanan berbelanja.',
      kategori: 'Ekonomi',
      anggaran: 800000000,
      sumberDana: 'APBD Kabupaten & Dana Desa',
      timeline: '12 bulan (Januari - Desember 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 35,
      penanggungJawab: 'Dinas Perdagangan',
      foto: '/uploads/program/pasar-desa.jpg'
    },
    {
      nama: 'Program BUMDes Maju Bersama',
      deskripsi: 'Pendirian dan pengembangan Badan Usaha Milik Desa (BUMDes) dengan unit usaha simpan pinjam, toko sembako, dan jasa penyewaan alat pertanian.',
      kategori: 'Ekonomi',
      anggaran: 200000000,
      sumberDana: 'Dana Desa',
      timeline: 'Ongoing',
      status: 'SEDANG_BERJALAN',
      progress: 70,
      penanggungJawab: 'Pengelola BUMDes',
      foto: '/uploads/program/bumdes.jpg'
    },
    {
      nama: 'Pemasangan Lampu Jalan Solar Cell',
      deskripsi: 'Instalasi 100 titik lampu jalan tenaga surya di seluruh wilayah desa. Hemat energi, ramah lingkungan, dan meningkatkan keamanan warga di malam hari.',
      kategori: 'Infrastruktur',
      anggaran: 250000000,
      sumberDana: 'Dana Desa & Bantuan ESDM',
      timeline: '3 bulan (April - Juni 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 90,
      penanggungJawab: 'Dinas Energi',
      foto: '/uploads/program/lampu-solar.jpg'
    },
    {
      nama: 'Pembangunan Balai Pertemuan',
      deskripsi: 'Membangun balai pertemuan warga dengan kapasitas 300 orang. Dilengkapi panggung, sound system, dan dapur. Untuk rapat, acara, dan kegiatan kemasyarakatan.',
      kategori: 'Sosial',
      anggaran: 350000000,
      sumberDana: 'Dana Desa',
      timeline: '6 bulan (Mei - Oktober 2025)',
      status: 'PERENCANAAN',
      progress: 15,
      penanggungJawab: 'Pemerintah Desa',
      foto: '/uploads/program/balai-pertemuan.jpg'
    },
    {
      nama: 'Pengadaan Ambulans Desa',
      deskripsi: 'Membeli 1 unit mobil ambulans lengkap dengan peralatan medis darurat untuk membantu warga dalam keadaan darurat kesehatan.',
      kategori: 'Kesehatan',
      anggaran: 150000000,
      sumberDana: 'Dana Desa & Donasi',
      timeline: '2 bulan (Mei - Juni 2025)',
      status: 'PERENCANAAN',
      progress: 25,
      penanggungJawab: 'Dinas Kesehatan',
      foto: '/uploads/program/ambulans.jpg'
    },
    {
      nama: 'Program Pertanian Organik',
      deskripsi: 'Pelatihan dan pendampingan petani untuk beralih ke pertanian organik. Pengadaan bibit unggul, pupuk organik, dan sistem irigasi tetes.',
      kategori: 'Pertanian',
      anggaran: 100000000,
      sumberDana: 'Dana Desa & Kementan',
      timeline: '12 bulan (Januari - Desember 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 50,
      penanggungJawab: 'Dinas Pertanian',
      foto: '/uploads/program/pertanian-organik.jpg'
    },
    {
      nama: 'Pembangunan Saluran Irigasi',
      deskripsi: 'Perbaikan dan pembangunan saluran irigasi sepanjang 3 km untuk mengaliri sawah seluas 50 hektar. Meningkatkan produktivitas pertanian.',
      kategori: 'Pertanian',
      anggaran: 200000000,
      sumberDana: 'APBD Provinsi',
      timeline: '4 bulan (Juli - Oktober 2025)',
      status: 'PERENCANAAN',
      progress: 10,
      penanggungJawab: 'Dinas Pertanian',
      foto: '/uploads/program/irigasi.jpg'
    },
    {
      nama: 'Pelatihan UMKM Digital',
      deskripsi: 'Program pelatihan bagi pelaku UMKM untuk go digital. Materi meliputi digital marketing, e-commerce, pembukuan digital, dan akses permodalan online.',
      kategori: 'Ekonomi',
      anggaran: 50000000,
      sumberDana: 'Dana Desa & Kemenkop',
      timeline: '3 bulan (Agustus - Oktober 2025)',
      status: 'PERENCANAAN',
      progress: 5,
      penanggungJawab: 'Dinas Koperasi',
      foto: '/uploads/program/umkm-digital.jpg'
    },
    {
      nama: 'Bank Sampah Desa',
      deskripsi: 'Pendirian bank sampah untuk mengelola sampah warga dengan sistem reward. Sampah dipilah, dijual, dan diolah menjadi produk bernilai ekonomis.',
      kategori: 'Lingkungan',
      anggaran: 75000000,
      sumberDana: 'Dana Desa & CSR',
      timeline: '6 bulan (Mei - Oktober 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 40,
      penanggungJawab: 'Dinas Lingkungan Hidup',
      foto: '/uploads/program/bank-sampah.jpg'
    },
    {
      nama: 'Reboisasi Hutan Desa',
      deskripsi: 'Penanaman 10.000 pohon di lahan kritis dan hutan desa. Melibatkan warga, sekolah, dan organisasi masyarakat untuk kelestarian lingkungan.',
      kategori: 'Lingkungan',
      anggaran: 60000000,
      sumberDana: 'Dana Desa & KLHK',
      timeline: '8 bulan (Maret - Oktober 2025)',
      status: 'SEDANG_BERJALAN',
      progress: 60,
      penanggungJawab: 'Dinas Kehutanan',
      foto: '/uploads/program/reboisasi.jpg'
    },
    {
      nama: 'Pembangunan Lapangan Olahraga',
      deskripsi: 'Membangun lapangan olahraga multifungsi dengan rumput sintetis, tribun penonton, dan lampu sorot. Untuk sepak bola, futsal, dan voli.',
      kategori: 'Olahraga',
      anggaran: 450000000,
      sumberDana: 'APBD Kabupaten',
      timeline: '7 bulan (Juni - Desember 2025)',
      status: 'PERENCANAAN',
      progress: 0,
      penanggungJawab: 'Dispora',
      foto: '/uploads/program/lapangan-olahraga.jpg'
    },
    {
      nama: 'Digitalisasi Administrasi Desa',
      deskripsi: 'Implementasi sistem informasi desa untuk pelayanan publik online. Warga bisa mengurus surat-menyurat dari rumah melalui aplikasi.',
      kategori: 'Administrasi',
      anggaran: 80000000,
      sumberDana: 'Dana Desa',
      timeline: '5 bulan (Juli - November 2025)',
      status: 'PERENCANAAN',
      progress: 20,
      penanggungJawab: 'Kemendagri & Kominfo',
      foto: '/uploads/program/digitalisasi.jpg'
    },
    {
      nama: 'Penerangan Jalan Umum (PJU)',
      deskripsi: 'Penambahan dan perbaikan sistem penerangan jalan umum di gang-gang kecil yang masih gelap. Meningkatkan keamanan dan kenyamanan warga.',
      kategori: 'Infrastruktur',
      anggaran: 120000000,
      sumberDana: 'Dana Desa',
      timeline: '3 bulan (Agustus - Oktober 2025)',
      status: 'PERENCANAAN',
      progress: 0,
      penanggungJawab: 'PLN & Pemdes',
      foto: '/uploads/program/pju.jpg'
    },
    {
      nama: 'Festival Budaya Desa',
      deskripsi: 'Menggelar festival budaya tahunan untuk melestarikan seni dan budaya lokal. Menampilkan tari tradisional, musik, kuliner, dan pameran kerajinan.',
      kategori: 'Budaya',
      anggaran: 100000000,
      sumberDana: 'Dana Desa & Sponsor',
      timeline: '1 bulan (November 2025)',
      status: 'PERENCANAAN',
      progress: 10,
      penanggungJawab: 'Dinas Pariwisata',
      foto: '/uploads/program/festival-budaya.jpg'
    },
    {
      nama: 'Kolam Renang Umum',
      deskripsi: 'Pembangunan kolam renang umum dengan kolam dewasa dan anak-anak. Fasilitas meliputi kamar bilas, kantin, dan area parkir luas.',
      kategori: 'Olahraga',
      anggaran: 600000000,
      sumberDana: 'APBD Kabupaten & Swasta',
      timeline: '10 bulan (Januari - Oktober 2026)',
      status: 'PERENCANAAN',
      progress: 0,
      penanggungJawab: 'Dispora',
      foto: '/uploads/program/kolam-renang.jpg'
    },
    {
      nama: 'Program Kampung KB',
      deskripsi: 'Program pemberdayaan keluarga melalui Kampung Keluarga Berencana. Edukasi kesehatan reproduksi, ekonomi keluarga, dan pengasuhan anak.',
      kategori: 'Sosial',
      anggaran: 40000000,
      sumberDana: 'BKKBN & Dana Desa',
      timeline: '12 bulan (Ongoing)',
      status: 'SEDANG_BERJALAN',
      progress: 75,
      penanggungJawab: 'BKKBN',
      foto: '/uploads/program/kampung-kb.jpg'
    }
  ];

  const now = new Date();
  for (let i = 0; i < programData.length; i++) {
    // Random date dalam 1 tahun terakhir untuk program lama
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.programPembangunan.create({
      data: {
        ...programData[i],
        createdAt: createdAt,
        updatedAt: new Date() // Update terakhir
      }
    });
  }

  console.log(`✅ ${programData.length} program pembangunan created`);
  return prisma.programPembangunan.findMany();
}

module.exports = { seedProgram };
