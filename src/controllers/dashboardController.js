const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalLaporan,
      totalWisata,
      totalUMKM,
      totalTransactions,
      totalProgram,
      laporanByStatus,
      transactions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.laporan.count(),
      prisma.wisataDesa.count(),
      prisma.uMKM.count(),
      prisma.transaction.count(),
      prisma.programPembangunan.count(),
      prisma.laporan.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.transaction.findMany({
        where: { status: 'PAID' },
        select: { totalHarga: true }
      })
    ]);

    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalHarga, 0);

    const laporanStatus = {
      PENDING: 0,
      PROSES: 0,
      SELESAI: 0,
      DITOLAK: 0
    };

    laporanByStatus.forEach(item => {
      laporanStatus[item.status] = item._count.status;
    });

    const totalLaporanSelesai = laporanStatus.SELESAI;
    const completionRate = totalLaporan > 0 
      ? Math.round((totalLaporanSelesai / totalLaporan) * 100) 
      : 0;

    const monthlyData = await getMonthlyData();
    const dailyData = await getDailyData();
    const recentActivities = await getRecentActivities();

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalLaporan,
          totalWisata,
          totalUMKM,
          totalTransactions,
          totalProgram,
          revenue: totalRevenue,
          completionRate
        },
        laporanStatus,
        monthlyData,
        dailyData,
        recentActivities
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik dashboard',
      error: error.message
    });
  }
};

const getMonthlyData = async () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const currentMonth = new Date().getMonth();
  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59);

    const [laporan, laporanSelesai, transactions] = await Promise.all([
      prisma.laporan.count({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        }
      }),
      prisma.laporan.count({
        where: {
          status: 'SELESAI',
          updatedAt: { gte: startDate, lte: endDate }
        }
      }),
      prisma.transaction.findMany({
        where: {
          status: 'PAID',
          createdAt: { gte: startDate, lte: endDate }
        },
        select: { totalHarga: true }
      })
    ]);

    const revenue = transactions.reduce((sum, t) => sum + t.totalHarga, 0);

    monthlyData.push({
      month: months[monthIndex],
      laporan,
      selesai: laporanSelesai,
      revenue,
      transactions: transactions.length
    });
  }

  return monthlyData;
};

const getDailyData = async () => {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const dailyData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const [wisata, umkm, laporan] = await Promise.all([
      prisma.wisataDesa.count({
        where: {
          createdAt: { gte: date, lte: endDate }
        }
      }),
      prisma.uMKM.count({
        where: {
          createdAt: { gte: date, lte: endDate }
        }
      }),
      prisma.laporan.count({
        where: {
          createdAt: { gte: date, lte: endDate }
        }
      })
    ]);

    dailyData.push({
      day: days[date.getDay()],
      wisata,
      umkm,
      laporan
    });
  }

  return dailyData;
};

const getRecentActivities = async () => {
  try {
    const [recentLaporan, recentTransactions, recentUMKM, recentUsers] = await Promise.all([
      prisma.laporan.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      }).catch(() => []),
      prisma.transaction.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        where: { status: 'PAID' },
        include: {
          wisata: {
            select: { nama: true }
          },
          user: {
            select: { name: true }
          }
        }
      }).catch(() => []),
      prisma.uMKM.findMany({
        take: 1,
        orderBy: { createdAt: 'desc' }
      }).catch(() => []),
      prisma.user.findMany({
        take: 1,
        orderBy: { createdAt: 'desc' }
      }).catch(() => [])
    ]);

    const activities = [];

    recentLaporan.forEach(laporan => {
      activities.push({
        id: laporan.id,
        type: 'laporan',
        message: `Laporan baru: ${laporan.judul}`,
        status: laporan.status.toLowerCase(),
        createdAt: laporan.createdAt,
        user: laporan.user?.name || 'User'
      });
    });

    recentTransactions.forEach(transaction => {
      activities.push({
        id: transaction.id,
        type: 'transaction',
        message: `Pembayaran tiket ${transaction.wisata?.nama || 'Wisata'} berhasil`,
        status: 'success',
        createdAt: transaction.createdAt,
        user: transaction.user?.name || 'User'
      });
    });

    recentUMKM.forEach(umkm => {
      activities.push({
        id: umkm.id,
        type: 'umkm',
        message: `UMKM baru terdaftar: ${umkm.nama}`,
        status: 'info',
        createdAt: umkm.createdAt
      });
    });

    recentUsers.forEach(user => {
      activities.push({
        id: user.id,
        type: 'user',
        message: `Pengguna baru mendaftar: ${user.name}`,
        status: 'info',
        createdAt: user.createdAt
      });
    });

    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(activity => ({
        ...activity,
        timeAgo: getTimeAgo(activity.createdAt)
      }));
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return [];
  }
};

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} detik yang lalu`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari yang lalu`;
  return `${Math.floor(seconds / 604800)} minggu yang lalu`;
};

module.exports = {
  getStats
};