const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedBerita() {
  console.log('🌱 Seeding Berita...');

  const beritaData = [
    {
      judul: 'Perbaikan Jalan Desa Capai 65 Persen',
      konten: `Pemerintah Desa Suka Maju melaporkan bahwa progress perbaikan jalan utama desa telah mencapai 65 persen. Kepala Desa H. Suharto menyampaikan optimisme bahwa proyek ini dapat selesai tepat waktu pada Juni 2025.

"Alhamdulillah, pekerjaan berjalan lancar. Kami berterima kasih atas kesabaran warga selama proses pembangunan," ujar Kepala Desa.

Proyek senilai Rp 500 juta ini meliputi pengerasan jalan sepanjang 5 km dengan drainase yang memadai. Diharapkan mobilitas warga akan semakin lancar setelah proyek ini rampung.`,
      kategori: 'Pembangunan',
      author: 'Admin Desa',
      foto: '/uploads/berita/perbaikan-jalan.jpg',
      isPublish: true
    },
    {
      judul: 'Posyandu Baru Siap Beroperasi',
      konten: `Gedung Posyandu Melati yang baru dibangun dengan anggaran Rp 150 juta sudah 80 persen selesai dan diperkirakan dapat beroperasi bulan depan. Fasilitas kesehatan ini akan melayani pemeriksaan ibu hamil, balita, dan lansia dengan lebih nyaman.

Bu Marlina, Sekretaris Desa, mengatakan bahwa posyandu baru ini dilengkapi dengan ruang tunggu ber-AC, ruang pemeriksaan yang lebih luas, dan gudang obat yang memadai.

"Ini adalah komitmen kami untuk meningkatkan kualitas layanan kesehatan di desa," jelasnya.`,
      kategori: 'Kesehatan',
      author: 'Admin Desa',
      foto: '/uploads/berita/posyandu.jpg',
      isPublish: true
    },
    {
      judul: 'Festival Budaya Desa Siap Digelar November 2025',
      konten: `Panitia Festival Budaya Desa Suka Maju 2025 telah terbentuk dan mulai mempersiapkan acara tahunan yang dinanti-nanti warga. Festival ini akan menampilkan berbagai seni budaya lokal, pameran UMKM, dan kuliner khas desa.

Ketua Panitia, Pak Wahyu Hidayat, mengungkapkan bahwa tahun ini akan ada tambahan acara kompetisi fotografi dan lomba lukis dengan tema "Keindahan Desa Suka Maju".

Festival akan berlangsung selama 3 hari di lapangan desa dan terbuka untuk umum dengan gratis. Diharapkan acara ini dapat menarik wisatawan dan meningkatkan ekonomi warga.`,
      kategori: 'Budaya',
      author: 'Admin Desa',
      foto: '/uploads/berita/festival.jpg',
      isPublish: true
    },
    {
      judul: 'BUMDes Catat Omzet Rp 50 Juta Per Bulan',
      konten: `BUMDes Maju Bersama mencatatkan prestasi gemilang dengan omzet mencapai Rp 50 juta per bulan dari unit usaha simpan pinjam, toko sembako, dan rental alat pertanian.

Direktur BUMDes, Bapak Agus Priyanto, menjelaskan bahwa keuntungan akan dikembalikan untuk kesejahteraan warga melalui program-program pemberdayaan masyarakat.

"Kami berencana membuka unit usaha baru di bidang pengolahan hasil pertanian dan pariwisata," ungkap Pak Agus.

BUMDes juga telah memberikan pinjaman modal usaha tanpa bunga kepada 50 UMKM lokal dengan total penyaluran Rp 200 juta.`,
      kategori: 'Ekonomi',
      author: 'Admin Desa',
      foto: '/uploads/berita/bumdes.jpg',
      isPublish: true
    },
    {
      judul: 'Pemasangan 100 Lampu Solar Cell Hampir Rampung',
      konten: `Proyek pemasangan lampu jalan bertenaga surya di 100 titik lokasi telah mencapai progress 90 persen. Warga sangat antusias dengan program ini karena akan menghemat biaya listrik desa sekaligus ramah lingkungan.

Penanggung jawab proyek dari Dinas Energi menyatakan bahwa lampu solar cell ini dapat bertahan hingga 10 tahun dengan perawatan minimal. Setiap lampu memiliki panel surya 50 watt dengan baterai yang dapat menyala sepanjang malam.

"Ini adalah investasi jangka panjang untuk keamanan dan kenyamanan warga," terang petugas.`,
      kategori: 'Pembangunan',
      author: 'Admin Desa',
      foto: '/uploads/berita/solar-cell.jpg',
      isPublish: true
    },
    {
      judul: 'Desa Suka Maju Raih Penghargaan Desa Wisata Terbaik',
      konten: `Desa Suka Maju berhasil meraih penghargaan sebagai Desa Wisata Terbaik tingkat Kabupaten Makmur tahun 2024. Penghargaan ini diserahkan langsung oleh Bupati dalam acara Anugerah Desa Wisata di Pendopo Kabupaten.

Kepala Desa H. Suharto menyampaikan rasa syukur dan bangga atas pencapaian ini. "Ini adalah hasil kerja keras seluruh warga yang menjaga kebersihan, keindahan, dan kelestarian budaya kita," katanya.

Desa Suka Maju memiliki 15 destinasi wisata yang dikemas dengan apik, mulai dari wisata alam, budaya, hingga agrowisata. Tahun lalu, desa ini dikunjungi oleh lebih dari 50.000 wisatawan.`,
      kategori: 'Pariwisata',
      author: 'Admin Desa',
      foto: '/uploads/berita/penghargaan.jpg',
      isPublish: true
    },
    {
      judul: 'Program Pertanian Organik Tingkatkan Hasil Panen 30%',
      konten: `Program pertanian organik yang dijalankan sejak awal tahun berhasil meningkatkan hasil panen petani hingga 30 persen. Sebanyak 100 petani telah bergabung dalam program ini dan merasakan manfaatnya.

Pak Eko Prasetyo, salah satu petani peserta, mengaku sangat terbantu dengan pelatihan dan bantuan pupuk organik gratis. "Selain hasil panen meningkat, harga jualnya juga lebih tinggi karena produk organik banyak diminati," ceritanya.

Dinas Pertanian akan terus mendampingi petani dan berencana memperluas program ini ke 200 petani tahun depan.`,
      kategori: 'Pertanian',
      author: 'Admin Desa',
      foto: '/uploads/berita/pertanian-organik.jpg',
      isPublish: true
    },
    {
      judul: 'Bank Sampah Desa Kelola 2 Ton Sampah Per Bulan',
      konten: `Bank Sampah Desa Suka Maju yang baru beroperasi 6 bulan lalu berhasil mengelola 2 ton sampah per bulan dari 300 rumah yang tergabung sebagai nasabah.

Ketua Bank Sampah, Ibu Sri Wahyuni, menjelaskan bahwa sampah yang terkumpul dipilah menjadi plastik, kertas, logam, dan organik. Sampah anorganik dijual ke pengepul, sedangkan sampah organik diolah menjadi kompos.

"Setiap nasabah mendapat buku tabungan dan bisa menukar poin dengan sembako atau uang tunai," jelas Bu Sri.

Program ini tidak hanya mengurangi volume sampah di TPS, tapi juga memberikan penghasilan tambahan bagi warga.`,
      kategori: 'Lingkungan',
      author: 'Admin Desa',
      foto: '/uploads/berita/bank-sampah.jpg',
      isPublish: true
    },
    {
      judul: 'Reboisasi 10.000 Pohon Sudah 60% Tercapai',
      konten: `Program reboisasi hutan desa yang menargetkan penanaman 10.000 pohon sudah mencapai 6.000 pohon atau 60 persen. Kegiatan ini melibatkan warga, pelajar, dan organisasi lingkungan.

Jenis pohon yang ditanam meliputi mahoni, jati, pinus, dan pohon buah-buahan. Setiap pohon diberi label nama penanak untuk kemudahan monitoring.

Kepala Dusun III, Pak Hendra Wijaya, berharap dalam 10 tahun ke depan kawasan ini menjadi hutan produktif yang dapat memberikan manfaat ekonomi dan ekologi bagi warga.`,
      kategori: 'Lingkungan',
      author: 'Admin Desa',
      foto: '/uploads/berita/reboisasi.jpg',
      isPublish: true
    },
    {
      judul: 'Pelatihan UMKM Digital Akan Digelar Agustus 2025',
      konten: `Pemerintah Desa bekerja sama dengan Dinas Koperasi akan menggelar pelatihan UMKM digital untuk 100 pelaku usaha di desa. Pelatihan ini gratis dan akan berlangsung selama 3 bulan.

Materi pelatihan meliputi digital marketing, pembuatan konten media sosial, e-commerce, pembukuan digital, dan akses permodalan online. Peserta juga akan dibantu membuat website atau toko online.

"Kami ingin UMKM desa go digital agar produknya bisa dikenal lebih luas dan omzet meningkat," ujar Sekretaris Desa.

Pendaftaran sudah dibuka dan bisa dilakukan di kantor desa atau online melalui website desa.`,
      kategori: 'Ekonomi',
      author: 'Admin Desa',
      foto: '/uploads/berita/pelatihan-umkm.jpg',
      isPublish: true
    },
    {
      judul: 'Siswa SDN 1 Juara Olimpiade Matematika',
      konten: `Membanggakan! Siswa kelas 5 SDN 1 Suka Maju, Ahmad Fajar Ramadhan, berhasil meraih juara 1 Olimpiade Matematika tingkat Kabupaten. Prestasi ini mengharumkan nama desa di kancah pendidikan.

Kepala Sekolah SDN 1, Ibu Ratna Sari, sangat bangga dengan pencapaian siswanya. "Ini membuktikan bahwa anak desa tidak kalah dengan anak kota," katanya.

Ahmad akan mewakili kabupaten di Olimpiade tingkat Provinsi bulan depan. Pemerintah Desa memberikan apresiasi dan dukungan penuh untuk persiapan Ahmad.`,
      kategori: 'Pendidikan',
      author: 'Admin Desa',
      foto: '/uploads/berita/olimpiade.jpg',
      isPublish: true
    },
    {
      judul: 'Renovasi SDN 1 Dimulai, Siswa Belajar di Gedung Sementara',
      konten: `Proyek renovasi total SDN 1 Suka Maju resmi dimulai hari ini. Selama renovasi, kegiatan belajar mengajar dipindahkan ke gedung sementara di balai desa.

Renovasi meliputi perbaikan atap yang bocor, pengecatan ulang, perbaikan lantai, dan pembangunan 2 ruang kelas baru. Proyek senilai Rp 300 juta ini ditargetkan selesai dalam 5 bulan.

"Mohon pengertian warga selama proses renovasi. Kami berjanji akan menyediakan fasilitas belajar yang nyaman bagi anak-anak," kata Kepala Desa.`,
      kategori: 'Pendidikan',
      author: 'Admin Desa',
      foto: '/uploads/berita/renovasi-sdn.jpg',
      isPublish: true
    },
    {
      judul: 'Pasar Desa Baru 35% Selesai, Target Rampung Akhir Tahun',
      konten: `Pembangunan pasar desa modern telah mencapai 35 persen dengan target selesai akhir tahun 2025. Pasar ini akan menampung 50 kios pedagang dengan fasilitas lengkap.

Arsitek proyek menjelaskan bahwa desain pasar mengadopsi konsep modern minimalis dengan sirkulasi udara yang baik. Lantai menggunakan keramik anti licin dan dilengkapi dengan sistem drainase yang baik.

Para pedagang pasar lama sangat antusias menanti pasar baru. "Alhamdulillah, kami akan punya tempat jualan yang lebih nyaman," ucap Bu Siti, pedagang sayur.`,
      kategori: 'Pembangunan',
      author: 'Admin Desa',
      foto: '/uploads/berita/pasar-baru.jpg',
      isPublish: true
    },
    {
      judul: 'Wisata Air Terjun Pelangi Ramai Dikunjungi',
      konten: `Memasuki musim liburan, Air Terjun Pelangi menjadi destinasi favorit wisatawan. Setiap hari, lokasi ini dikunjungi ratusan wisatawan dari berbagai daerah.

Pengelola wisata, Pak Bambang, mengatakan bahwa pekan lalu terjadi lonjakan kunjungan hingga 500 orang per hari. "Kami sudah menambah petugas keamanan dan kebersihan untuk memberikan pelayanan terbaik," jelasnya.

Retribusi dari objek wisata ini memberikan kontribusi signifikan bagi pendapatan asli desa. Tahun lalu, air terjun ini menyumbang Rp 200 juta untuk kas desa.`,
      kategori: 'Pariwisata',
      author: 'Admin Desa',
      foto: '/uploads/berita/air-terjun-ramai.jpg',
      isPublish: true
    },
    {
      judul: 'Pengadaan Ambulans Desa Dalam Tahap Perencanaan',
      konten: `Pemerintah Desa berencana mengadakan 1 unit ambulans desa lengkap dengan peralatan medis darurat. Kendaraan ini akan membantu warga dalam kondisi darurat kesehatan.

Anggaran sebesar Rp 150 juta dialokasikan dari Dana Desa dan sumbangan warga. Ambulans akan dikelola oleh petugas kesehatan terlatih dan siap beroperasi 24 jam.

"Ini adalah prioritas kami karena akses rumah sakit lumayan jauh. Dengan ambulans desa, warga bisa mendapat pertolongan lebih cepat," ujar Kepala Desa.

Pengadaan ditargetkan selesai pertengahan tahun 2025.`,
      kategori: 'Kesehatan',
      author: 'Admin Desa',
      foto: '/uploads/berita/ambulans.jpg',
      isPublish: true
    },
    {
      judul: 'Digitalisasi Administrasi Desa Segera Diluncurkan',
      konten: `Pemerintah Desa akan meluncurkan sistem informasi desa yang memungkinkan warga mengurus administrasi secara online. Aplikasi ini dapat diakses melalui smartphone.

Jenis layanan yang tersedia meliputi pembuatan surat keterangan, KTP, KK, surat izin usaha, dan pengaduan. Warga cukup mengisi formulir online dan dokumen bisa diambil di kantor desa atau dikirim ke rumah.

"Ini adalah langkah modernisasi pelayanan publik. Warga tidak perlu lagi antre lama di kantor desa," jelas Sekretaris Desa.

Sistem ini akan diluncurkan bulan Juli 2025 setelah pelatihan perangkat desa.`,
      kategori: 'Administrasi',
      author: 'Admin Desa',
      foto: '/uploads/berita/digitalisasi.jpg',
      isPublish: true
    },
    {
      judul: 'Tim Sepak Bola Desa Juara Turnamen Antar Desa',
      konten: `Tim sepak bola Desa Suka Maju berhasil menjuarai Turnamen Sepak Bola Antar Desa se-Kecamatan Sejahtera. Final yang berlangsung sengit dimenangkan dengan skor 2-1 melawan Desa Harmoni.

Kepala Desa memberikan bonus kepada seluruh pemain dan pelatih sebagai apresiasi atas prestasi yang membanggakan. "Kalian telah mengharumkan nama desa," puji Kepala Desa.

Tim akan mewakili kecamatan di turnamen tingkat kabupaten bulan depan. Warga memberikan dukungan penuh dan berharap tim bisa meraih prestasi lebih tinggi.`,
      kategori: 'Olahraga',
      author: 'Admin Desa',
      foto: '/uploads/berita/sepak-bola-juara.jpg',
      isPublish: true
    },
    {
      judul: 'Kampung KB Sukses Turunkan Angka Stunting',
      konten: `Program Kampung Keluarga Berencana (KB) di Desa Suka Maju berhasil menurunkan angka stunting dari 15% menjadi 8% dalam setahun terakhir. Ini adalah pencapaian luar biasa yang patut diapresiasi.

Program ini memberikan edukasi kesehatan ibu dan anak, pemberian makanan tambahan untuk balita, dan pemeriksaan kesehatan rutin. Sebanyak 150 keluarga telah mendapat pendampingan intensif.

Bidan Desa, Bu Aminah, menjelaskan bahwa kunci keberhasilan adalah kesadaran orangtua dan dukungan pemerintah desa. "Kami akan terus bekerja keras hingga angka stunting mencapai nol persen," tegasnya.`,
      kategori: 'Kesehatan',
      author: 'Admin Desa',
      foto: '/uploads/berita/kampung-kb.jpg',
      isPublish: true
    },
    {
      judul: 'Instalasi Air Bersih Sudah Melayani 100 Rumah',
      konten: `Proyek instalasi air bersih yang dimulai awal tahun kini sudah melayani 100 rumah warga. Target akhir adalah 150 rumah di tiga dusun.

Warga yang sudah terpasang sambungan air sangat puas karena air mengalir lancar 24 jam dengan kualitas jernih. Biaya bulanan juga terjangkau, hanya Rp 20.000 per bulan.

"Kami sangat bersyukur tidak perlu lagi susah payah mengambil air dari sumur atau mata air yang jauh," ungkap Bu Fatimah, warga RT 02.

Diharapkan seluruh target dapat tercapai sebelum Agustus 2025.`,
      kategori: 'Pembangunan',
      author: 'Admin Desa',
      foto: '/uploads/berita/air-bersih.jpg',
      isPublish: true
    },
    {
      judul: 'Kebun Strawberry Tawarkan Pengalaman Petik Sendiri',
      konten: `Agro Strawberry, destinasi agrowisata di Dusun II, kini ramai dikunjungi wisatawan yang ingin merasakan pengalaman memetik strawberry langsung dari kebun. Harga tiket Rp 30.000 sudah termasuk 250 gram strawberry.

Pemilik kebun, Pak Dedi, mengatakan bahwa konsep petik sendiri ini sangat disukai keluarga karena edukatif dan menyenangkan. "Anak-anak bisa belajar dari mana strawberry berasal," jelasnya.

Kebun ini juga menyediakan kafe yang menjual berbagai olahan strawberry seperti jus, smoothie, dan kue. Omzet harian bisa mencapai Rp 5 juta di akhir pekan.`,
      kategori: 'Pariwisata',
      author: 'Admin Desa',
      foto: '/uploads/berita/kebun-strawberry.jpg',
      isPublish: true
    }
  ];

  const now = new Date();
  for (let i = 0; i < beritaData.length; i++) {
    // Random date dalam 6 bulan terakhir
    const daysAgo = Math.floor(Math.random() * 180);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.berita.create({
      data: {
        ...beritaData[i],
        createdAt: createdAt,
        updatedAt: createdAt
      }
    });
  }

  console.log(`✅ ${beritaData.length} berita created`);
  return prisma.berita.findMany();
}

module.exports = { seedBerita };
