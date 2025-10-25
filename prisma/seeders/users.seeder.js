const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Helper function untuk generate random date di tahun 2025
function getRandomDateIn2025() {
  const start = new Date('2025-01-01');
  const end = new Date(); // Sampai hari ini
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}

async function seedUsers() {
  console.log('🌱 Seeding Users...');

  // Admin users - created di awal tahun
  const admins = [
    {
      email: 'admin@desa.id',
      password: await bcrypt.hash('admin123', 10),
      name: 'Administrator Desa',
      role: 'ADMIN',
      noTelp: '081234567890',
      alamat: 'Kantor Desa Suka Maju',
      createdAt: new Date('2025-01-05')
    },
    {
      email: 'sekretaris@desa.id',
      password: await bcrypt.hash('admin123', 10),
      name: 'Siti Marlina',
      role: 'ADMIN',
      noTelp: '081234567891',
      alamat: 'Kantor Desa Suka Maju',
      createdAt: new Date('2025-01-06')
    }
  ];

  // Warga users (30 users) - random dates
  const firstNames = ['Budi', 'Siti', 'Ahmad', 'Fatimah', 'Hasan', 'Aminah', 'Rizki', 'Dewi', 'Eko', 'Lilis', 
                      'Agus', 'Nur', 'Joko', 'Putri', 'Dedi', 'Sri', 'Bambang', 'Ratna', 'Wahyu', 'Indah',
                      'Andi', 'Maya', 'Rudi', 'Yanti', 'Fajar', 'Dian', 'Tono', 'Lina', 'Hendra', 'Sari'];
  
  const lastNames = ['Santoso', 'Wijaya', 'Pratama', 'Kusuma', 'Putra', 'Putri', 'Setiawan', 'Wibowo', 'Firmansyah', 'Hidayat',
                     'Hakim', 'Saputra', 'Raharjo', 'Suryanto', 'Permana', 'Nugroho', 'Utomo', 'Kurniawan', 'Aditya', 'Pramudya'];

  const streets = ['Jl. Merdeka', 'Jl. Pemuda', 'Jl. Pancasila', 'Jl. Diponegoro', 'Jl. Sudirman', 'Jl. Kartini', 
                   'Jl. Veteran', 'Jl. Gatot Subroto', 'Jl. Ahmad Yani', 'Jl. Pahlawan'];

  const wargas = [];
  for (let i = 0; i < 150; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const rt = String(Math.floor(Math.random() * 5) + 1).padStart(2, '0');
    const rw = String(Math.floor(Math.random() * 5) + 1).padStart(2, '0');
    
    wargas.push({
      email: `${firstName.toLowerCase()}${i + 1}@gmail.com`,
      password: await bcrypt.hash('warga123', 10),
      name: `${firstName} ${lastName}`,
      role: 'WARGA',
      noTelp: `0812${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
      alamat: `${street} No. ${Math.floor(Math.random() * 50) + 1}, RT ${rt}/RW ${rw}`,
      createdAt: getRandomDateIn2025() // ✅ Random date
    });
  }

  // Visitor users (20 users) - random dates
  const visitorNames = ['Rina Setiawan', 'David Chen', 'Lisa Anderson', 'Kevin Tan', 'Sarah Johnson',
                        'Michael Wong', 'Jessica Lee', 'Daniel Kim', 'Sophie Martin', 'Alex Brown',
                        'Emily Davis', 'Ryan Wilson', 'Olivia Taylor', 'James Miller', 'Emma White',
                        'William Garcia', 'Ava Martinez', 'Noah Robinson', 'Isabella Clark', 'Lucas Lewis'];

  const visitors = [];
  for (let i = 0; i < 20; i++) {
    visitors.push({
      email: `visitor${i + 1}@gmail.com`,
      password: await bcrypt.hash('visitor123', 10),
      name: visitorNames[i],
      role: 'VISITOR',
      noTelp: `0856${String(Math.floor(Math.random() * 99999999)).padStart(8, '0')}`,
      createdAt: getRandomDateIn2025() // ✅ Random date
    });
  }

  const allUsers = [...admins, ...wargas, ...visitors];

  // Create users one by one
  for (const userData of allUsers) {
    await prisma.user.create({ data: userData });
  }

  console.log(`✅ ${allUsers.length} users created (${admins.length} admins, ${wargas.length} warga, ${visitors.length} visitors)`);
  console.log(`📅 Created dates spread across 2025`);
  
  return prisma.user.findMany();
}

module.exports = { seedUsers };
