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

// ✅ FIXED: Public endpoint untuk homepage dengan data real-time dari database
const getHomeStats = async (req, res) => {
  try {
    // Get current date info
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    // Get total WARGA users
    const totalWarga = await prisma.user.count({
      where: { role: 'WARGA' }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const populationData = [];

    // ✅ Generate data hanya untuk bulan yang sudah lewat + bulan sekarang
    for (let monthIndex = 0; monthIndex <= currentMonth; monthIndex++) {
      const startDate = new Date(currentYear, monthIndex, 1);
      const endDate = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59);

      // Count cumulative users up to end of this month
      const count = await prisma.user.count({
        where: {
          role: 'WARGA',
          createdAt: { lte: endDate }
        }
      });

      populationData.push({
        month: months[monthIndex],
        value: count,
        date: startDate.toISOString().split('T')[0]
      });
    }

    // Calculate growth rate (comparing last month vs month before)
    let growthRate = 0;
    if (populationData.length >= 2) {
      const lastMonth = populationData[populationData.length - 1]?.value || 0;
      const prevMonth = populationData[populationData.length - 2]?.value || 0;
      
      if (prevMonth > 0) {
        growthRate = ((lastMonth - prevMonth) / prevMonth * 100);
      } else if (lastMonth > 0) {
        growthRate = 100; // 100% growth if previous was 0
      }
    }

    res.json({
      success: true,
      data: {
        population: {
          total: totalWarga,
          growthRate: parseFloat(growthRate.toFixed(2)),
          monthlyData: populationData
        }
      }
    });
  } catch (error) {
    console.error('Error getting home stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik homepage',
      error: error.message
    });
  }
};

// ✅ NEW: Public endpoint untuk StatistikDesa section
const getPublicStats = async (req, res) => {
  try {
    const { timeRange = '3months' } = req.query;

    // Get total counts
    const [totalWisata, totalUMKM, totalWarga] = await Promise.all([
      prisma.wisataDesa.count({ where: { isAktif: true } }),
      prisma.uMKM.count({ where: { isAktif: true } }),
      prisma.user.count({ where: { role: 'WARGA' } })
    ]);

    // Calculate total tourists from successful transactions (sum jumlahTiket)
    const transactions = await prisma.transaction.findMany({
      where: { 
        status: 'PAID',
        tanggalKunjungan: {
          gte: new Date(new Date().getFullYear(), 0, 1) // Start of current year
        }
      },
      select: { jumlahTiket: true }
    });

    const totalTourists = transactions.reduce((sum, t) => sum + t.jumlahTiket, 0);

    // Get population growth data based on timeRange
    const populationData = await getPopulationData(timeRange);

    // Calculate growth rate
    let growthRate = 0;
    if (populationData.length >= 2) {
      const lastPeriod = populationData[populationData.length - 1]?.value || 0;
      const prevPeriod = populationData[populationData.length - 2]?.value || 0;
      
      if (prevPeriod > 0) {
        growthRate = ((lastPeriod - prevPeriod) / prevPeriod * 100);
      } else if (lastPeriod > 0) {
        growthRate = 100;
      }
    }

    res.json({
      success: true,
      data: {
        totalWisata,
        totalUMKM,
        totalTourists,
        population: {
          total: totalWarga,
          growthRate: parseFloat(growthRate.toFixed(2)),
          monthlyData: populationData
        }
      }
    });
  } catch (error) {
    console.error('Error getting public stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik publik',
      error: error.message
    });
  }
};

// Helper function untuk get population data by time range
const getPopulationData = async (timeRange) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  
  let startMonth = 0;
  let monthCount = 0;

  switch (timeRange) {
    case '3months':
      monthCount = 3;
      startMonth = Math.max(0, currentMonth - 2);
      break;
    case '6months':
      monthCount = 6;
      startMonth = Math.max(0, currentMonth - 5);
      break;
    case '1year':
      monthCount = 12;
      startMonth = 0;
      break;
    default:
      monthCount = 3;
      startMonth = Math.max(0, currentMonth - 2);
  }

  const populationData = [];

  for (let i = startMonth; i <= currentMonth; i++) {
    const endDate = new Date(currentYear, i + 1, 0, 23, 59, 59);

    // Count cumulative WARGA users up to end of this month
    const count = await prisma.user.count({
      where: {
        role: 'WARGA',
        createdAt: { lte: endDate }
      }
    });

    populationData.push({
      month: monthsId[i],
      value: count,
      date: new Date(currentYear, i, 1).toISOString().split('T')[0]
    });
  }

  // Return only the requested number of months from the end
  return populationData.slice(-monthCount);
};

// ✅ NEW: Public endpoint untuk UmkmDanWisata section
const getUmkmWisataStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    // Get total UMKM aktif
    const totalUMKM = await prisma.uMKM.count({
      where: { isAktif: true }
    });

    // Get UMKM created this year
    const umkmThisYear = await prisma.uMKM.count({
      where: {
        isAktif: true,
        createdAt: { gte: startOfYear, lte: endOfYear }
      }
    });

    // Calculate UMKM growth rate (comparing this year vs last year)
    const lastYearStart = new Date(currentYear - 1, 0, 1);
    const lastYearEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59);
    
    const umkmLastYear = await prisma.uMKM.count({
      where: {
        isAktif: true,
        createdAt: { gte: lastYearStart, lte: lastYearEnd }
      }
    });

    let umkmGrowthRate = 0;
    if (umkmLastYear > 0) {
      umkmGrowthRate = ((umkmThisYear - umkmLastYear) / umkmLastYear * 100);
    } else if (umkmThisYear > 0) {
      umkmGrowthRate = 100;
    }

    // Get total Wisata aktif
    const totalWisata = await prisma.wisataDesa.count({
      where: { isAktif: true }
    });

    // Get total transactions (visitors) this year
    const transactionsThisYear = await prisma.transaction.findMany({
      where: {
        status: 'PAID',
        tanggalKunjungan: { gte: startOfYear, lte: endOfYear }
      },
      select: { jumlahTiket: true }
    });

    const totalVisitorsThisYear = transactionsThisYear.reduce(
      (sum, t) => sum + t.jumlahTiket, 
      0
    );

    // Get total visitors last year
    const transactionsLastYear = await prisma.transaction.findMany({
      where: {
        status: 'PAID',
        tanggalKunjungan: { gte: lastYearStart, lte: lastYearEnd }
      },
      select: { jumlahTiket: true }
    });

    const totalVisitorsLastYear = transactionsLastYear.reduce(
      (sum, t) => sum + t.jumlahTiket, 
      0
    );

    // Calculate visitor growth rate
    let visitorGrowthRate = 0;
    if (totalVisitorsLastYear > 0) {
      visitorGrowthRate = ((totalVisitorsThisYear - totalVisitorsLastYear) / totalVisitorsLastYear * 100);
    } else if (totalVisitorsThisYear > 0) {
      visitorGrowthRate = 100;
    }

    res.json({
      success: true,
      data: {
        umkm: {
          total: totalUMKM,
          thisYear: umkmThisYear,
          growthRate: parseFloat(umkmGrowthRate.toFixed(2))
        },
        wisata: {
          total: totalWisata,
          visitorsThisYear: totalVisitorsThisYear,
          visitorGrowthRate: parseFloat(visitorGrowthRate.toFixed(2))
        }
      }
    });
  } catch (error) {
    console.error('Error getting UMKM & Wisata stats:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik UMKM & Wisata',
      error: error.message
    });
  }
};

module.exports = {
  getStats,
  getHomeStats,
  getPublicStats,
  getUmkmWisataStats // ✅ Export new function
};