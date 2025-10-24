const { PrismaClient } = require('@prisma/client');
const { seedUsers } = require('./seeders/users.seeder');
const { seedProfilDesa } = require('./seeders/profil-desa.seeder');
const { seedLaporan } = require('./seeders/laporan.seeder');
const { seedWisata } = require('./seeders/wisata.seeder');
const { seedTransactions } = require('./seeders/transactions.seeder');
const { seedUMKM } = require('./seeders/umkm.seeder');
const { seedProgram } = require('./seeders/program.seeder');
const { seedBerita } = require('./seeders/berita.seeder');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');
  console.log('================================================');

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    console.log('🧹 Clearing existing data...');
    await prisma.transaction.deleteMany();
    await prisma.berita.deleteMany();
    await prisma.programPembangunan.deleteMany();
    await prisma.uMKM.deleteMany();
    await prisma.wisataDesa.deleteMany();
    await prisma.laporan.deleteMany();
    await prisma.profilDesa.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Existing data cleared\n');

    // Seed in order
    console.log('================================================\n');
    const users = await seedUsers();
    console.log('');
    
    await seedProfilDesa();
    console.log('');
    
    await seedLaporan(users);
    console.log('');
    
    const wisataList = await seedWisata();
    console.log('');
    
    await seedTransactions(users, wisataList);
    console.log('');
    
    await seedUMKM();
    console.log('');
    
    await seedProgram();
    console.log('');
    
    await seedBerita();
    console.log('');

    console.log('================================================');
    console.log('✅ Seeding completed successfully!');
    console.log('================================================');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length} (2 admins, 30 warga, 20 visitors)`);
    console.log(`- Profil Desa: 1`);
    console.log(`- Wisata: ${wisataList.length}`);
    console.log('- Laporan: 120');
    console.log('- Transactions: 250');
    console.log('- UMKM: 30');
    console.log('- Program: 20');
    console.log('- Berita: 20');
    console.log('\n🔐 Default Credentials:');
    console.log('- Admin: admin@desa.id / admin123');
    console.log('- Warga: budi1@gmail.com / warga123');
    console.log('- Visitor: visitor1@gmail.com / visitor123');
    console.log('\n🎉 Database is ready for use!\n');

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
