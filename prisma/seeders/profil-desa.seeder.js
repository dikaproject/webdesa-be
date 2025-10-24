const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProfilDesa() {
  console.log('🌱 Seeding Profil Desa...');

  const profilDesa = await prisma.profilDesa.create({
    data: {
      namaDesa: 'Desa Suka Maju',
      kecamatan: 'Kecamatan Sejahtera',
      kabupaten: 'Kabupaten Makmur',
      provinsi: 'Jawa Barat',
      kodePos: '40123',
      luasWilayah: 15.5,
      visiMisi: `Visi: 
Mewujudkan Desa Suka Maju yang mandiri, sejahtera, dan berkelanjutan melalui pemberdayaan masyarakat dan pemanfaatan potensi lokal.

Misi:
1. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan
2. Mengembangkan ekonomi kreatif dan UMKM berbasis potensi lokal
3. Membangun infrastruktur yang memadai dan merata
4. Melestarikan lingkungan hidup dan kearifan lokal
5. Meningkatkan pelayanan publik yang cepat dan transparan
6. Mendorong partisipasi aktif masyarakat dalam pembangunan desa`,
      sejarah: `Desa Suka Maju didirikan pada tahun 1945 oleh para pejuang kemerdekaan yang memilih menetap di kawasan ini setelah proklamasi kemerdekaan Indonesia. Nama "Suka Maju" diambil dari semangat masyarakat yang selalu ingin berkembang dan maju.

Pada awal berdirinya, Desa Suka Maju hanya dihuni oleh sekitar 50 kepala keluarga. Seiring berjalannya waktu, desa ini berkembang pesat menjadi salah satu desa percontohan di kabupaten berkat kerja keras dan gotong royong masyarakatnya.

Tahun 1970-an menjadi titik balik perkembangan desa dengan dibukanya jalan utama yang menghubungkan desa dengan kota kabupaten. Sejak saat itu, akses transportasi semakin mudah dan membuka peluang ekonomi baru bagi warga.

Pada tahun 2000, Desa Suka Maju mulai mengembangkan sektor pariwisata dengan memanfaatkan keindahan alam dan kearifan lokal. Kini, desa ini dikenal sebagai destinasi wisata desa yang menarik dengan berbagai potensi UMKM yang berkembang.`,
      geografis: `Desa Suka Maju terletak di dataran tinggi dengan ketinggian berkisar antara 800-1200 meter di atas permukaan laut. Desa ini dikelilingi oleh perbukitan hijau yang asri dengan pemandangan alam yang menawan.

Kondisi Geografis:
- Luas Wilayah: 15,5 km²
- Batas Utara: Desa Maju Jaya
- Batas Selatan: Desa Sejahtera Abadi
- Batas Timur: Desa Harmoni
- Batas Barat: Hutan Lindung Gunung Hijau

Topografi wilayah terdiri dari:
- 40% dataran tinggi
- 35% perbukitan
- 15% lembah
- 10% kawasan hutan

Desa ini memiliki beberapa sumber mata air alami yang menjadi sumber kehidupan masyarakat. Iklim sejuk dengan suhu rata-rata 18-25°C sepanjang tahun membuat desa ini cocok untuk pertanian hortikultura dan perkebunan teh.`,
      struktur: `STRUKTUR PEMERINTAHAN DESA SUKA MAJU

Kepala Desa: H. Suharto, S.Sos
Sekretaris Desa: Siti Marlina, S.AP

KEPALA URUSAN (KAUR):
- Kaur Pemerintahan: Joko Susilo, S.IP
- Kaur Pembangunan: Budi Santoso, ST
- Kaur Kesejahteraan Rakyat: Aminah Zahra, S.Sos
- Kaur Keuangan: Sri Wahyuni, SE
- Kaur Umum dan Perencanaan: Agus Priyanto, S.Kom

KEPALA DUSUN:
- Dusun I: Bambang Hermawan
- Dusun II: Eko Prasetyo  
- Dusun III: Hendra Wijaya

LEMBAGA DESA:
- Ketua BPD: Wahyu Hidayat
- Ketua LPMD: Dedi Kurniawan
- Ketua PKK: Ibu Ratna Sari
- Ketua Karang Taruna: Rizki Ramadhan`,
      kontak: '022-87654321',
      email: 'info@desasukamaju.id',
      website: 'https://desasukamaju.id',
      foto: '/uploads/profileDesa/desa-profile.jpg'
    }
  });

  console.log('✅ Profil Desa created');
  return profilDesa;
}

module.exports = { seedProfilDesa };
