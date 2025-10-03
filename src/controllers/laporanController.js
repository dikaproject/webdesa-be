const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllLaporan = async (req, res) => {
  try {
    const { status, kategori, userId } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (kategori) where.kategori = kategori;
    if (userId) where.userId = userId;

    const laporan = await prisma.laporan.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const getLaporanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const laporan = await prisma.laporan.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            noTelp: true
          }
        }
      }
    });

    if (!laporan) {
      return res.status(404).json({ 
        success: false,
        message: 'Laporan tidak ditemukan' 
      });
    }

    res.status(200).json({
      success: true,
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const getLaporanByIdUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const laporan = await prisma.laporan.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const createLaporan = async (req, res) => {
  try {
    const { judul, deskripsi, kategori, lokasi, foto } = req.body;
    const userId = req.user.id;

    const laporan = await prisma.laporan.create({
      data: {
        judul,
        deskripsi,
        kategori,
        lokasi,
        foto,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Laporan berhasil dibuat',
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const updateLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, deskripsi, kategori, lokasi, foto } = req.body;

    const existingLaporan = await prisma.laporan.findUnique({
      where: { id }
    });

    if (!existingLaporan) {
      return res.status(404).json({ 
        success: false,
        message: 'Laporan tidak ditemukan' 
      });
    }

    if (existingLaporan.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah laporan ini' 
      });
    }

    const laporan = await prisma.laporan.update({
      where: { id },
      data: {
        judul,
        deskripsi,
        kategori,
        lokasi,
        foto
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Laporan berhasil diperbarui',
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const updateStatusLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tanggapan } = req.body;

    const existingLaporan = await prisma.laporan.findUnique({
      where: { id }
    });

    if (!existingLaporan) {
      return res.status(404).json({ 
        success: false,
        message: 'Laporan tidak ditemukan' 
      });
    }

    const laporan = await prisma.laporan.update({
      where: { id },
      data: {
        status,
        tanggapan
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Status laporan berhasil diperbarui',
      data: laporan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const deleteLaporan = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLaporan = await prisma.laporan.findUnique({
      where: { id }
    });

    if (!existingLaporan) {
      return res.status(404).json({ 
        success: false,
        message: 'Laporan tidak ditemukan' 
      });
    }

    if (existingLaporan.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        message: 'Anda tidak memiliki akses untuk menghapus laporan ini' 
      });
    }

    await prisma.laporan.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Laporan berhasil dihapus'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

module.exports = { 
  getAllLaporan, 
  getLaporanById, 
  createLaporan, 
  updateLaporan, 
  updateStatusLaporan,
  deleteLaporan,
  getLaporanByIdUser
};