const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedWisata() {
  console.log('🌱 Seeding Wisata Baturaden...');

  const wisataData = [
    {
      slug: 'lokawisata-baturaden',
      nama: 'Lokawisata Baturaden',
      deskripsi: 'Objek wisata utama di Baturaden dengan berbagai wahana permainan, pemandian air panas alami, dan suasana pegunungan yang sejuk. Tempat rekreasi keluarga terlengkap dengan fasilitas modern di kaki Gunung Slamet.',
      lokasi: 'Jl. Raya Baturaden, Desa Baturaden, Kecamatan Baturaden',
      kategori: 'Rekreasi',
      harga: 20000,
      jamBuka: '08:00',
      jamTutup: '17:00',
      kontak: '082134567890',
      foto: '/uploads/wisata/lokawisata-baturaden.jpg',
      gambar: [
        '/uploads/wisata/lokawisata-1.jpg',
        '/uploads/wisata/lokawisata-2.jpg',
        '/uploads/wisata/lokawisata-3.jpg',
        '/uploads/wisata/lokawisata-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir Luas', icon: 'parking' },
        { nama: 'Toilet Bersih', icon: 'restroom' },
        { nama: 'Food Court', icon: 'restaurant' },
        { nama: 'Gazebo & Saung', icon: 'pavilion' },
        { nama: 'Spot Foto Instagramable', icon: 'camera' },
        { nama: 'Pemandu Wisata', icon: 'guide' },
        { nama: 'Mushola', icon: 'mosque' },
        { nama: 'Toko Oleh-oleh', icon: 'store' }
      ],
      latitude: -7.3144,
      longitude: 109.2369,
      isAktif: true
    },
    {
      slug: 'curug-cipendok',
      nama: 'Curug Cipendok',
      deskripsi: 'Air terjun setinggi 92 meter yang dikelilingi hutan pinus. Salah satu air terjun tertinggi di Jawa Tengah dengan suasana alam yang masih asri dan udara yang sangat sejuk. Cocok untuk petualangan dan hunting foto.',
      lokasi: 'Desa Karangtengah, Kecamatan Cilongok',
      kategori: 'Alam',
      harga: 10000,
      jamBuka: '07:00',
      jamTutup: '17:00',
      kontak: '081234567891',
      foto: '/uploads/wisata/curug-cipendok.jpg',
      gambar: [
        '/uploads/wisata/cipendok-1.jpg',
        '/uploads/wisata/cipendok-2.jpg',
        '/uploads/wisata/cipendok-3.jpg',
        '/uploads/wisata/cipendok-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet', icon: 'restroom' },
        { nama: 'Warung Makan', icon: 'restaurant' },
        { nama: 'Gazebo', icon: 'pavilion' },
        { nama: 'Spot Foto', icon: 'camera' },
        { nama: 'Jalur Tracking', icon: 'guide' }
      ],
      latitude: -7.3428,
      longitude: 109.2156,
      isAktif: true
    },
    {
      slug: 'pancuran-pitu',
      nama: 'Pancuran Pitu',
      deskripsi: 'Pemandian air panas alami dengan 7 pancuran yang dipercaya memiliki khasiat penyembuhan. Air panas mengandung belerang yang baik untuk kesehatan kulit. Suasana tradisional dengan sentuhan modern.',
      lokasi: 'Desa Ketenger, Kecamatan Baturaden',
      kategori: 'Pemandian',
      harga: 15000,
      jamBuka: '06:00',
      jamTutup: '18:00',
      kontak: '081234567892',
      foto: '/uploads/wisata/pancuran-pitu.jpg',
      gambar: [
        '/uploads/wisata/pancuran-pitu-1.jpg',
        '/uploads/wisata/pancuran-pitu-2.jpg',
        '/uploads/wisata/pancuran-pitu-3.jpg',
        '/uploads/wisata/pancuran-pitu-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet & Kamar Mandi', icon: 'restroom' },
        { nama: 'Warung Makan', icon: 'restaurant' },
        { nama: 'Ruang Bilas', icon: 'restroom' },
        { nama: 'Area Istirahat', icon: 'pavilion' },
        { nama: 'Locker', icon: 'store' }
      ],
      latitude: -7.3156,
      longitude: 109.2344,
      isAktif: true
    },
    {
      slug: 'pancuran-telu',
      nama: 'Pancuran Telu',
      deskripsi: 'Pemandian air panas dengan 3 pancuran yang lebih intim dan natural. Suasana lebih tenang cocok untuk relaksasi. Air panas langsung dari sumber alami Gunung Slamet.',
      lokasi: 'Desa Ketenger, Kecamatan Baturaden',
      kategori: 'Pemandian',
      harga: 12000,
      jamBuka: '06:00',
      jamTutup: '18:00',
      kontak: '081234567893',
      foto: '/uploads/wisata/pancuran-telu.jpg',
      gambar: [
        '/uploads/wisata/pancuran-telu-1.jpg',
        '/uploads/wisata/pancuran-telu-2.jpg',
        '/uploads/wisata/pancuran-telu-3.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet', icon: 'restroom' },
        { nama: 'Warung', icon: 'restaurant' },
        { nama: 'Gazebo', icon: 'pavilion' }
      ],
      latitude: -7.3167,
      longitude: 109.2322,
      isAktif: true
    },
    {
      slug: 'kebun-raya-baturaden',
      nama: 'Kebun Raya Baturaden',
      deskripsi: 'Taman konservasi ex-situ dengan koleksi flora dari berbagai daerah. Tempat edukasi dan rekreasi dengan udara sejuk pegunungan. Cocok untuk outing keluarga dan belajar tentang keanekaragaman hayati.',
      lokasi: 'Desa Kemutug Lor, Kecamatan Baturaden',
      kategori: 'Edukasi',
      harga: 25000,
      jamBuka: '08:00',
      jamTutup: '16:00',
      kontak: '081234567894',
      foto: '/uploads/wisata/kebun-raya.jpg',
      gambar: [
        '/uploads/wisata/kebun-raya-1.jpg',
        '/uploads/wisata/kebun-raya-2.jpg',
        '/uploads/wisata/kebun-raya-3.jpg',
        '/uploads/wisata/kebun-raya-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir Luas', icon: 'parking' },
        { nama: 'Toilet Bersih', icon: 'restroom' },
        { nama: 'Kantin', icon: 'restaurant' },
        { nama: 'Taman Bermain Anak', icon: 'picnic' },
        { nama: 'Spot Foto', icon: 'camera' },
        { nama: 'Pemandu Wisata', icon: 'guide' },
        { nama: 'Mushola', icon: 'mosque' }
      ],
      latitude: -7.3233,
      longitude: 109.2411,
      isAktif: true
    },
    {
      slug: 'the-village-purwokerto',
      nama: 'The Village Purwokerto',
      deskripsi: 'Destinasi wisata modern dengan konsep European Village. Tempat yang instagramable dengan bangunan ala Eropa, taman bunga warna-warni, dan berbagai spot foto menarik. Cocok untuk kaum milenial.',
      lokasi: 'Jl. Raya Baturaden KM 8, Purwokerto',
      kategori: 'Rekreasi',
      harga: 30000,
      jamBuka: '08:00',
      jamTutup: '18:00',
      kontak: '081234567895',
      foto: '/uploads/wisata/the-village.jpg',
      gambar: [
        '/uploads/wisata/village-1.jpg',
        '/uploads/wisata/village-2.jpg',
        '/uploads/wisata/village-3.jpg',
        '/uploads/wisata/village-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet Modern', icon: 'restroom' },
        { nama: 'Cafe & Restaurant', icon: 'cafe' },
        { nama: 'Toko Souvenir', icon: 'store' },
        { nama: 'Spot Foto Unik', icon: 'camera' },
        { nama: 'Free WiFi', icon: 'wifi' }
      ],
      latitude: -7.3089,
      longitude: 109.2456,
      isAktif: true
    },
    {
      slug: 'bukit-watu-meja',
      nama: 'Bukit Watu Meja',
      deskripsi: 'Puncak dengan pemandangan 360 derajat kota Purwokerto dan sekitarnya. Tempat favorit untuk menikmati sunrise dan sunset. Sensasi petualangan dengan tracking ringan menuju puncak.',
      lokasi: 'Desa Ketenger, Kecamatan Baturaden',
      kategori: 'Alam',
      harga: 8000,
      jamBuka: '05:00',
      jamTutup: '19:00',
      kontak: '081234567896',
      foto: '/uploads/wisata/watu-meja.jpg',
      gambar: [
        '/uploads/wisata/watu-meja-1.jpg',
        '/uploads/wisata/watu-meja-2.jpg',
        '/uploads/wisata/watu-meja-3.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet Sederhana', icon: 'restroom' },
        { nama: 'Warung Kopi', icon: 'cafe' },
        { nama: 'Spot Sunrise/Sunset', icon: 'camera' },
        { nama: 'Jalur Tracking', icon: 'guide' }
      ],
      latitude: -7.3211,
      longitude: 109.2289,
      isAktif: true
    },
    {
      slug: 'telaga-sunyi',
      nama: 'Telaga Sunyi',
      deskripsi: 'Telaga alami di tengah hutan pinus yang menenangkan. Suasana mistis dan damai, cocok untuk meditasi atau sekadar menikmati ketenangan alam. Air telaga jernih berwarna kehijauan.',
      lokasi: 'Desa Kemutug Lor, Kecamatan Baturaden',
      kategori: 'Alam',
      harga: 5000,
      jamBuka: '07:00',
      jamTutup: '17:00',
      kontak: '081234567897',
      foto: '/uploads/wisata/telaga-sunyi.jpg',
      gambar: [
        '/uploads/wisata/telaga-sunyi-1.jpg',
        '/uploads/wisata/telaga-sunyi-2.jpg',
        '/uploads/wisata/telaga-sunyi-3.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet', icon: 'restroom' },
        { nama: 'Gazebo', icon: 'pavilion' },
        { nama: 'Spot Foto', icon: 'camera' }
      ],
      latitude: -7.3178,
      longitude: 109.2400,
      isAktif: true
    },
    {
      slug: 'baturaden-adventure-forest',
      nama: 'Baturaden Adventure Forest',
      deskripsi: 'Taman petualangan dengan flying fox, high rope, dan outbound. Cocok untuk team building, gathering, atau tantangan adrenalin. Dilengkapi instruktur berpengalaman dan peralatan standar keamanan internasional.',
      lokasi: 'Desa Ketenger, Kecamatan Baturaden',
      kategori: 'Adventure',
      harga: 50000,
      jamBuka: '08:00',
      jamTutup: '17:00',
      kontak: '081234567898',
      foto: '/uploads/wisata/adventure-forest.jpg',
      gambar: [
        '/uploads/wisata/adventure-1.jpg',
        '/uploads/wisata/adventure-2.jpg',
        '/uploads/wisata/adventure-3.jpg',
        '/uploads/wisata/adventure-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet & Locker', icon: 'restroom' },
        { nama: 'Kantin', icon: 'restaurant' },
        { nama: 'Instruktur Profesional', icon: 'guide' },
        { nama: 'Peralatan Safety', icon: 'safety' },
        { nama: 'Ruang Meeting', icon: 'pavilion' }
      ],
      latitude: -7.3189,
      longitude: 109.2367,
      isAktif: true
    },
    {
      slug: 'small-world-purwokerto',
      nama: 'Small World Purwokerto',
      deskripsi: 'Taman miniatur dengan replika bangunan ikonik dunia. Berkeliling dunia dalam satu tempat! Cocok untuk edukasi anak dan spot foto keluarga yang unik.',
      lokasi: 'Jl. Raya Baturaden, Purwokerto',
      kategori: 'Rekreasi',
      harga: 35000,
      jamBuka: '08:00',
      jamTutup: '17:00',
      kontak: '081234567899',
      foto: '/uploads/wisata/small-world.jpg',
      gambar: [
        '/uploads/wisata/small-world-1.jpg',
        '/uploads/wisata/small-world-2.jpg',
        '/uploads/wisata/small-world-3.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet', icon: 'restroom' },
        { nama: 'Food Court', icon: 'restaurant' },
        { nama: 'Toko Souvenir', icon: 'store' },
        { nama: 'Spot Foto Miniatur', icon: 'camera' },
        { nama: 'Playground Anak', icon: 'picnic' }
      ],
      latitude: -7.3122,
      longitude: 109.2378,
      isAktif: true
    },
    {
      slug: 'owabong-waterpark',
      nama: 'Owabong Waterpark',
      deskripsi: 'Waterpark terbesar di Jawa Tengah dengan berbagai wahana air seru. Kolam ombak, seluncuran ekstrem, lazy river, dan kolam anak. Tempat favorit keluarga untuk bermain air sepuasnya.',
      lokasi: 'Jl. Raya Baturaden, Purwokerto',
      kategori: 'Rekreasi',
      harga: 60000,
      jamBuka: '08:00',
      jamTutup: '17:00',
      kontak: '081234567800',
      foto: '/uploads/wisata/owabong.jpg',
      gambar: [
        '/uploads/wisata/owabong-1.jpg',
        '/uploads/wisata/owabong-2.jpg',
        '/uploads/wisata/owabong-3.jpg',
        '/uploads/wisata/owabong-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir Super Luas', icon: 'parking' },
        { nama: 'Toilet & Shower', icon: 'restroom' },
        { nama: 'Food Court', icon: 'restaurant' },
        { nama: 'Locker Pribadi', icon: 'store' },
        { nama: 'Gazebo VIP', icon: 'pavilion' },
        { nama: 'Lifeguard', icon: 'guide' },
        { nama: 'Mushola', icon: 'mosque' }
      ],
      latitude: -7.3100,
      longitude: 109.2333,
      isAktif: true
    },
    {
      slug: 'curug-gede',
      nama: 'Curug Gede',
      deskripsi: 'Air terjun megah dengan ketinggian 30 meter di tengah hutan alami. Tracking menuju curug melewati jembatan kayu dan sungai kecil. Suara gemuruh air terjun sangat menenangkan.',
      lokasi: 'Desa Ketenger, Kecamatan Baturaden',
      kategori: 'Alam',
      harga: 7000,
      jamBuka: '07:00',
      jamTutup: '17:00',
      kontak: '081234567801',
      foto: '/uploads/wisata/curug-gede.jpg',
      gambar: [
        '/uploads/wisata/curug-gede-1.jpg',
        '/uploads/wisata/curug-gede-2.jpg',
        '/uploads/wisata/curug-gede-3.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet', icon: 'restroom' },
        { nama: 'Warung', icon: 'restaurant' },
        { nama: 'Jalur Tracking', icon: 'guide' },
        { nama: 'Spot Foto', icon: 'camera' }
      ],
      latitude: -7.3256,
      longitude: 109.2267,
      isAktif: true
    },
    {
      slug: 'bumi-perkemahan-baturaden',
      nama: 'Bumi Perkemahan Baturaden',
      deskripsi: 'Area perkemahan luas dengan fasilitas lengkap di kaki Gunung Slamet. Cocok untuk camping, outbound, dan kegiatan kepramukaan. Udara sejuk dan pemandangan pegunungan yang indah.',
      lokasi: 'Desa Kemutug Lor, Kecamatan Baturaden',
      kategori: 'Camping',
      harga: 40000,
      jamBuka: '24 Jam',
      jamTutup: '24 Jam',
      kontak: '081234567802',
      foto: '/uploads/wisata/camping.jpg',
      gambar: [
        '/uploads/wisata/camping-1.jpg',
        '/uploads/wisata/camping-2.jpg',
        '/uploads/wisata/camping-3.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet & Kamar Mandi', icon: 'restroom' },
        { nama: 'Kantin 24 Jam', icon: 'restaurant' },
        { nama: 'Api Unggun Area', icon: 'picnic' },
        { nama: 'Lapangan Upacara', icon: 'pavilion' },
        { nama: 'Penyewaan Tenda', icon: 'store' }
      ],
      latitude: -7.3267,
      longitude: 109.2423,
      isAktif: true
    },
    {
      slug: 'baturraden-zoo',
      nama: 'Baturraden Zoo',
      deskripsi: 'Kebun binatang dengan koleksi satwa lengkap dari berbagai belahan dunia. Tempat edukasi tentang konservasi satwa yang menyenangkan untuk keluarga. Bisa memberi makan langsung beberapa hewan jinak.',
      lokasi: 'Jl. Raya Baturaden, Purwokerto',
      kategori: 'Edukasi',
      harga: 45000,
      jamBuka: '08:00',
      jamTutup: '16:30',
      kontak: '081234567803',
      foto: '/uploads/wisata/zoo.jpg',
      gambar: [
        '/uploads/wisata/zoo-1.jpg',
        '/uploads/wisata/zoo-2.jpg',
        '/uploads/wisata/zoo-3.jpg',
        '/uploads/wisata/zoo-4.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir Luas', icon: 'parking' },
        { nama: 'Toilet Bersih', icon: 'restroom' },
        { nama: 'Food Court', icon: 'restaurant' },
        { nama: 'Playground Anak', icon: 'picnic' },
        { nama: 'Petting Zoo', icon: 'guide' },
        { nama: 'Toko Souvenir', icon: 'store' },
        { nama: 'Mushola', icon: 'mosque' }
      ],
      latitude: -7.3111,
      longitude: 109.2356,
      isAktif: true
    },
    {
      slug: 'puncak-tuk-bima-lukar',
      nama: 'Puncak Tuk Bima Lukar',
      deskripsi: 'Spot terbaik untuk melihat sunrise dengan pemandangan 270 derajat. Tracking sedang dengan waktu tempuh 30 menit. View kota Purwokerto, pegunungan, dan Gunung Slamet sangat jelas dari sini.',
      lokasi: 'Desa Ketenger, Kecamatan Baturaden',
      kategori: 'Alam',
      harga: 5000,
      jamBuka: '04:00',
      jamTutup: '19:00',
      kontak: '081234567804',
      foto: '/uploads/wisata/puncak-bima.jpg',
      gambar: [
        '/uploads/wisata/puncak-1.jpg',
        '/uploads/wisata/puncak-2.jpg',
        '/uploads/wisata/puncak-3.jpg'
      ],
      fasilitas: [
        { nama: 'Area Parkir', icon: 'parking' },
        { nama: 'Toilet Sederhana', icon: 'restroom' },
        { nama: 'Warung Kopi', icon: 'cafe' },
        { nama: 'Spot Sunrise', icon: 'camera' },
        { nama: 'Gazebo', icon: 'pavilion' }
      ],
      latitude: -7.3289,
      longitude: 109.2301,
      isAktif: true
    }
  ];

  try {
    const createdWisata = [];
    for (const data of wisataData) {
      const wisata = await prisma.wisataDesa.upsert({
        where: { slug: data.slug },
        update: data,
        create: data
      });
      createdWisata.push(wisata);
      console.log(`  ✓ ${wisata.nama} - Rp ${wisata.harga.toLocaleString('id-ID')}`);
    }
    console.log(`✅ ${createdWisata.length} wisata Baturaden created`);
    return createdWisata;
  } catch (error) {
    console.error('❌ Error seeding Wisata:', error);
    throw error;
  }
}

module.exports = { seedWisata };