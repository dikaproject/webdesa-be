const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedLaporan(users) {
  console.log('🌱 Seeding Laporan...');

  const wargaUsers = users.filter(u => u.role === 'WARGA');
  
  const laporanTemplates = [
    // INFRASTRUKTUR
    { judul: 'Jalan Rusak di RT 01', deskripsi: 'Jalan di depan rumah pak RT mengalami kerusakan parah akibat hujan deras. Banyak lubang yang membahayakan pengendara motor dan mobil.', kategori: 'INFRASTRUKTUR', lokasi: 'Jl. Merdeka RT 01/RW 02' },
    { judul: 'Lampu Jalan Mati', deskripsi: 'Lampu penerangan jalan sudah mati selama 2 minggu. Kondisi jalan menjadi gelap di malam hari dan rawan kecelakaan.', kategori: 'INFRASTRUKTUR', lokasi: 'Jl. Pemuda RT 02/RW 01' },
    { judul: 'Gorong-gorong Tersumbat', deskripsi: 'Gorong-gorong di dekat pasar tersumbat sampah sehingga menyebabkan banjir saat hujan deras.', kategori: 'INFRASTRUKTUR', lokasi: 'Jl. Pasar RT 03/RW 02' },
    { judul: 'Jembatan Retak', deskripsi: 'Jembatan penghubung antar dusun mulai retak dan berbahaya untuk dilalui kendaraan berat.', kategori: 'INFRASTRUKTUR', lokasi: 'Jembatan Dusun II' },
    { judul: 'Pagar Sekolah Roboh', deskripsi: 'Pagar sekolah dasar roboh akibat angin kencang, membahayakan keselamatan siswa.', kategori: 'INFRASTRUKTUR', lokasi: 'SDN Suka Maju 1' },
    { judul: 'Jalan Berlubang Depan Masjid', deskripsi: 'Kondisi jalan di depan masjid banyak lubang besar yang dapat membahayakan jamaah.', kategori: 'INFRASTRUKTUR', lokasi: 'Jl. Masjid Al-Ikhlas' },
    { judul: 'Drainase Rusak', deskripsi: 'Sistem drainase di perumahan tidak berfungsi optimal sehingga air menggenang saat hujan.', kategori: 'INFRASTRUKTUR', lokasi: 'Perumahan Griya Asri' },
    { judul: 'Paving Block Rusak', deskripsi: 'Paving block di trotoar banyak yang rusak dan lepas, membahayakan pejalan kaki.', kategori: 'INFRASTRUKTUR', lokasi: 'Jl. Sudirman' },
    
    // KESEHATAN
    { judul: 'Sampah Menumpuk', deskripsi: 'Tumpukan sampah di TPS sudah tidak terangkut selama seminggu dan mulai berbau. Berpotensi menimbulkan penyakit.', kategori: 'KESEHATAN', lokasi: 'TPS RT 04/RW 03' },
    { judul: 'Air Bersih Keruh', deskripsi: 'Air PDAM yang mengalir ke rumah warga berwarna keruh dan berbau. Warga khawatir tidak layak untuk dikonsumsi.', kategori: 'KESEHATAN', lokasi: 'Dusun III' },
    { judul: 'Sarang Nyamuk DBD', deskripsi: 'Banyak genangan air di sekitar rumah kosong yang menjadi sarang nyamuk demam berdarah.', kategori: 'KESEHATAN', lokasi: 'Jl. Kartini RT 05/RW 02' },
    { judul: 'Limbah Pabrik Berbau', deskripsi: 'Limbah dari pabrik tahu mencemari sungai dan menimbulkan bau tidak sedap.', kategori: 'KESEHATAN', lokasi: 'Sungai Ciliwung' },
    { judul: 'Posyandu Tidak Lengkap', deskripsi: 'Fasilitas posyandu kurang memadai, tidak ada timbangan bayi dan alat ukur tinggi badan.', kategori: 'KESEHATAN', lokasi: 'Posyandu Mawar RT 01' },
    
    // PENDIDIKAN
    { judul: 'Atap Sekolah Bocor', deskripsi: 'Atap ruang kelas SDN 1 bocor saat hujan sehingga mengganggu proses belajar mengajar.', kategori: 'PENDIDIKAN', lokasi: 'SDN Suka Maju 1' },
    { judul: 'Buku Perpustakaan Kurang', deskripsi: 'Perpustakaan desa kekurangan buku bacaan untuk anak-anak dan buku pelajaran.', kategori: 'PENDIDIKAN', lokasi: 'Perpustakaan Desa' },
    { judul: 'Meja Kursi Sekolah Rusak', deskripsi: 'Banyak meja dan kursi di kelas yang sudah rusak dan tidak layak pakai.', kategori: 'PENDIDIKAN', lokasi: 'SMPN 2 Sejahtera' },
    { judul: 'Papan Tulis Tidak Jelas', deskripsi: 'Papan tulis di beberapa kelas sudah kusam dan tulisan tidak terlihat jelas.', kategori: 'PENDIDIKAN', lokasi: 'SDN Suka Maju 2' },
    
    // LINGKUNGAN
    { judul: 'Pohon Rawan Tumbang', deskripsi: 'Pohon besar di pinggir jalan dalam kondisi keropos dan rawan tumbang menimpa rumah warga.', kategori: 'LINGKUNGAN', lokasi: 'Jl. Veteran RT 02/RW 01' },
    { judul: 'Sungai Tercemar', deskripsi: 'Sungai tercemar limbah rumah tangga dan sampah plastik. Warga kesulitan mendapatkan air bersih.', kategori: 'LINGKUNGAN', lokasi: 'Sungai Cisadane' },
    { judul: 'Lahan Kritis Rawan Longsor', deskripsi: 'Lahan di perbukitan mulai kritis dan rawan longsor terutama saat musim hujan.', kategori: 'LINGKUNGAN', lokasi: 'Bukit Hijau Dusun III' },
    { judul: 'Pembuangan Limbah Sembarangan', deskripsi: 'Ada pihak yang membuang limbah pabrik sembarangan di lahan kosong.', kategori: 'LINGKUNGAN', lokasi: 'Lahan Kosong Jl. Industri' },
    { judul: 'Illegal Logging', deskripsi: 'Terindikasi ada penebangan pohon ilegal di hutan lindung desa.', kategori: 'LINGKUNGAN', lokasi: 'Hutan Lindung Desa' },
    
    // KEAMANAN
    { judul: 'Pencurian Motor', deskripsi: 'Terjadi pencurian sepeda motor di area parkir masjid pada malam hari.', kategori: 'KEAMANAN', lokasi: 'Masjid Al-Ikhlas' },
    { judul: 'Penerangan Kurang', deskripsi: 'Penerangan jalan sangat minim sehingga rawan tindak kejahatan.', kategori: 'KEAMANAN', lokasi: 'Gang Sepi RT 05/RW 03' },
    { judul: 'Balita Hilang', deskripsi: 'Anak balita hilang di area pasar, mohon bantuan pencarian.', kategori: 'KEAMANAN', lokasi: 'Pasar Desa' },
    { judul: 'Kebakaran Lahan', deskripsi: 'Terjadi kebakaran lahan kosong yang diduga disengaja.', kategori: 'KEAMANAN', lokasi: 'Lahan Kosong Dusun II' },
    
    // LAINNYA
    { judul: 'Hewan Ternak Berkeliaran', deskripsi: 'Sapi dan kambing warga berkeliaran di jalan raya membahayakan pengendara.', kategori: 'LAINNYA', lokasi: 'Jl. Raya Desa' },
    { judul: 'Papan Nama Jalan Rusak', deskripsi: 'Banyak papan nama jalan yang rusak atau hilang sehingga menyulitkan tamu yang berkunjung.', kategori: 'LAINNYA', lokasi: 'Berbagai lokasi' },
    { judul: 'Pengeras Suara Terlalu Keras', deskripsi: 'Pengeras suara masjid terlalu keras dan mengganggu warga yang sedang istirahat.', kategori: 'LAINNYA', lokasi: 'RT 03/RW 02' },
    { judul: 'Lapangan Olahraga Rusak', deskripsi: 'Lapangan sepak bola desa kondisinya rusak dan berlubang, tidak layak untuk digunakan.', kategori: 'LAINNYA', lokasi: 'Lapangan Desa' }
  ];

  const statuses = ['PENDING', 'PROSES', 'SELESAI', 'DITOLAK'];
  const tanggapanTemplates = {
    PROSES: [
      'Laporan Anda sedang dalam proses pengecekan oleh tim kami. Terima kasih atas partisipasinya.',
      'Tim teknis sudah ditugaskan untuk meninjau lokasi. Mohon kesabarannya.',
      'Laporan Anda telah kami terima dan sedang dalam proses tindak lanjut.',
      'Sedang dikoordinasikan dengan pihak terkait untuk penanganan lebih lanjut.'
    ],
    SELESAI: [
      'Terima kasih atas laporannya. Masalah telah berhasil ditangani dan diselesaikan.',
      'Perbaikan telah selesai dilakukan. Terima kasih atas partisipasi Anda dalam membangun desa.',
      'Alhamdulillah masalah telah teratasi. Jika ada keluhan lebih lanjut silakan hubungi kami.',
      'Sudah ditindaklanjuti dan selesai. Terima kasih atas kepedulian Anda terhadap lingkungan desa.'
    ],
    DITOLAK: [
      'Mohon maaf, laporan tidak dapat ditindaklanjuti karena bukan kewenangan pemerintah desa.',
      'Laporan ditolak karena data yang diberikan kurang lengkap. Silakan ajukan laporan baru dengan data yang lebih detail.',
      'Setelah pengecekan, kondisi di lapangan tidak sesuai dengan laporan. Terima kasih.',
      'Mohon maaf, untuk kasus ini silakan menghubungi instansi terkait yang lebih berwenang.'
    ]
  };

  const laporan = [];
  const now = new Date();

  // Generate 120 laporan: 100 dari warga + 20 dari guest
  for (let i = 0; i < 120; i++) {
    const template = laporanTemplates[Math.floor(Math.random() * laporanTemplates.length)];
    
    // ✅ 20 laporan pertama dari guest (userId = null), sisanya dari warga
    const isGuest = i < 20;
    const user = isGuest ? null : wargaUsers[Math.floor(Math.random() * wargaUsers.length)];
    
    // Random date dalam 6 bulan terakhir
    const daysAgo = Math.floor(Math.random() * 180);
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - daysAgo);
    
    // Status distribution: 30% PENDING, 25% PROSES, 40% SELESAI, 5% DITOLAK
    let status;
    const rand = Math.random();
    if (rand < 0.30) status = 'PENDING';
    else if (rand < 0.55) status = 'PROSES';
    else if (rand < 0.95) status = 'SELESAI';
    else status = 'DITOLAK';

    const tanggapan = status !== 'PENDING' 
      ? tanggapanTemplates[status][Math.floor(Math.random() * tanggapanTemplates[status].length)]
      : null;

    const laporanData = {
      judul: `${template.judul} - ${i + 1}`,
      deskripsi: template.deskripsi,
      kategori: template.kategori,
      status: status,
      lokasi: template.lokasi,
      foto: `/uploads/laporan/laporan-${i + 1}.jpg`,
      tanggapan: tanggapan,
      createdAt: createdAt,
      updatedAt: status !== 'PENDING' ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : createdAt
    };

    // ✅ Only add userId if not guest
    if (!isGuest && user) {
      laporanData.userId = user.id;
    }

    laporan.push(laporanData);
  }

  // Create laporan in batches
  for (const lap of laporan) {
    await prisma.laporan.create({ data: lap });
  }

  console.log(`✅ ${laporan.length} laporan created (${laporan.filter(l => !l.userId).length} from guests, ${laporan.filter(l => l.userId).length} from warga)`);
  return laporan;
}

module.exports = { seedLaporan };