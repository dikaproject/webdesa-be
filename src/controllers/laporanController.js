const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const { validateLaporanWithAI, heuristicValidation } = require('../services/laporanValidationService');

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
    console.log('=== CREATE LAPORAN DEBUG ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);
    
    const { judul, deskripsi, kategori, lokasi } = req.body;
    const userId = req.user?.id; // ✅ Optional - bisa null untuk guest
    const foto = req.file ? `/uploads/laporan/${req.file.filename}` : null;

    console.log('Processed data:', { judul, deskripsi, kategori, lokasi, foto, userId });

    // ✅ Validate kategori sesuai enum
    const validKategori = ['INFRASTRUKTUR', 'KESEHATAN', 'PENDIDIKAN', 'LINGKUNGAN', 'KEAMANAN', 'LAINNYA'];
    if (!validKategori.includes(kategori)) {
      return res.status(400).json({
        success: false,
        message: `Kategori tidak valid. Pilih salah satu: ${validKategori.join(', ')}`
      });
    }

    const laporan = await prisma.laporan.create({
      data: {
        judul,
        deskripsi,
        kategori,
        lokasi: lokasi || null,
        foto,
        ...(userId && { userId }) // ✅ Only include userId if exists
      },
      include: userId ? {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      } : undefined
    });

    console.log('Created laporan:', laporan);

    res.status(201).json({
      success: true,
      message: 'Laporan berhasil dibuat',
      data: laporan
    });
  } catch (error) {
    console.error('Create laporan error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
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
    const { status, tanggapan } = req.body; // Destructure langsung dari body

    console.log('Received data:', { id, status, tanggapan }); // Debug log

    const existingLaporan = await prisma.laporan.findUnique({
      where: { id }
    });

    if (!existingLaporan) {
      return res.status(404).json({ 
        success: false,
        message: 'Laporan tidak ditemukan' 
      });
    }

    // Update hanya field yang ada
    const updateData = {};
    if (status) updateData.status = status;
    if (tanggapan !== undefined) updateData.tanggapan = tanggapan;

    const laporan = await prisma.laporan.update({
      where: { id },
      data: updateData,
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
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message
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

/**
 * Validate Laporan Before Submit - AI Vision Analysis
 * Endpoint khusus untuk validasi laporan sebelum dikirim
 */
const validateLaporanBeforeSubmit = async (req, res) => {
  try {
    console.log('=== VALIDATE LAPORAN DEBUG ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { judul, deskripsi, kategori } = req.body;
    
    // Validate required fields
    if (!judul || !deskripsi || !kategori || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi (judul, deskripsi, kategori, foto)'
      });
    }

    // Validate kategori
    const validKategori = ['INFRASTRUKTUR', 'KESEHATAN', 'PENDIDIKAN', 'LINGKUNGAN', 'KEAMANAN', 'LAINNYA'];
    if (!validKategori.includes(kategori)) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak valid'
      });
    }

    // Get photo path
    const photoPath = path.join(__dirname, '..', '..', 'uploads', 'laporan', req.file.filename);
    
    console.log('Photo path:', photoPath);
    console.log('Validating with AI...');

    // Call AI validation service
    const validation = await validateLaporanWithAI(kategori, judul, deskripsi, photoPath);
    
    console.log('Validation result:', validation);

    // Return validation result
    res.status(200).json({
      success: true,
      validation: {
        valid: validation.valid,
        confidence: validation.confidence,
        reason: validation.reason,
        suggestions: validation.suggestions || '',
        skipped: validation.skipped || false,
        heuristic: validation.heuristic || false
      },
      message: validation.valid 
        ? 'Laporan valid dan dapat dikirim' 
        : 'Laporan tidak valid, mohon perbaiki'
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat validasi',
      error: error.message
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
  getLaporanByIdUser,
  validateLaporanBeforeSubmit
};