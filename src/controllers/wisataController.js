const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getWisataRecommendation } = require('../config/ai');

const getAllWisata = async (req, res) => {
    try {
        const wisata = await prisma.WisataDesa.findMany({
            select: {
                id: true,
                slug: true,
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                gambar: true,
                fasilitas: true,
                latitude: true,
                longitude: true,
                isAktif: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json({ success: true, data: wisata, message: 'Berhasil mengambil data Wisata Desa' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data Wisata Desa',
            error: error.message
        });
    }
}

const getWisataById = async (req, res) => {
    try {
        const { id } = req.params;
        const wisata = await prisma.WisataDesa.findUnique({
            where: { id },
            select: {
                id: true,
                slug: true,
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                gambar: true,
                fasilitas: true,
                latitude: true,
                longitude: true,
                isAktif: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!wisata) {
            return res.status(404).json({ success: false, message: 'Wisata Desa tidak ditemukan' });
        }
        res.json({ success: true, data: wisata });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data Wisata Desa',
            error: error.message
        });
    }
}

const getWisataBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const wisata = await prisma.WisataDesa.findFirst({
            where: { 
                OR: [
                    { slug: slug },
                    { id: slug }
                ],
                isAktif: true
            },
            select: {
                id: true,
                slug: true,
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                gambar: true,
                fasilitas: true,
                latitude: true,
                longitude: true,
                isAktif: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!wisata) {
            return res.status(404).json({ success: false, message: 'Wisata Desa tidak ditemukan' });
        }
        res.json({ success: true, data: wisata });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data Wisata Desa',
            error: error.message
        });
    }
}

const createWisata = async (req, res) => {
    try {
        const { nama, deskripsi, lokasi, kategori, harga, jamBuka, jamTutup, kontak, gambar, fasilitas, latitude, longitude, isAktif } = req.body;
        
        const slug = nama
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .trim();
        
        const hargaInt = harga ? parseInt(harga) : null;
        const lat = latitude ? parseFloat(latitude) : null;
        const lng = longitude ? parseFloat(longitude) : null;
        
        // Parse JSON if sent as string
        const gambarArray = typeof gambar === 'string' ? JSON.parse(gambar) : gambar;
        const fasilitasArray = typeof fasilitas === 'string' ? JSON.parse(fasilitas) : fasilitas;
        
        const wisata = await prisma.WisataDesa.create({
            data: { 
                slug,
                nama, 
                deskripsi, 
                lokasi, 
                kategori, 
                harga: hargaInt,
                jamBuka, 
                jamTutup, 
                kontak, 
                foto: req.file ? `/uploads/wisata/${req.file.filename}` : null,
                gambar: gambarArray || [],
                fasilitas: fasilitasArray || [],
                latitude: lat,
                longitude: lng,
                isAktif 
            }
        });
        res.status(201).json({ success: true, data: wisata, message: 'Berhasil menambahkan data Wisata Desa' });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan data Wisata Desa',
            error: error.message
        });
    }
}

const updateWisata = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, deskripsi, lokasi, kategori, harga, jamBuka, jamTutup, kontak, gambar, fasilitas, latitude, longitude, isAktif } = req.body;
        
        const hargaInt = harga ? parseInt(harga) : undefined;
        const lat = latitude ? parseFloat(latitude) : undefined;
        const lng = longitude ? parseFloat(longitude) : undefined;
        
        const gambarArray = typeof gambar === 'string' ? JSON.parse(gambar) : gambar;
        const fasilitasArray = typeof fasilitas === 'string' ? JSON.parse(fasilitas) : fasilitas;
        
        const wisata = await prisma.WisataDesa.update({
            where: { id },
            data: { 
                nama, 
                deskripsi, 
                lokasi, 
                kategori, 
                harga: hargaInt, 
                jamBuka, 
                jamTutup, 
                kontak, 
                foto: req.file ? `/uploads/wisata/${req.file.filename}` : undefined,
                gambar: gambarArray,
                fasilitas: fasilitasArray,
                latitude: lat,
                longitude: lng,
                isAktif 
            }
        });
        res.json({ success: true, data: wisata, message: 'Berhasil mengupdate data Wisata Desa' });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate data Wisata Desa',
            error: error.message
        });
    }
}

const deleteWisata = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.WisataDesa.delete({
            where: { id }
        });
        res.json({ success: true, message: 'Berhasil menghapus data Wisata Desa' });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus data Wisata Desa',
            error: error.message
        });
    }
}

const getAIRecommendation = async (req, res) => {
    try {
        const { location, numPeople, maxPrice } = req.body;

        // Validate input
        if (!numPeople || numPeople < 1) {
            return res.status(400).json({
                success: false,
                message: 'Jumlah orang harus minimal 1'
            });
        }

        // Get all active wisata
        const wisataList = await prisma.WisataDesa.findMany({
            where: { isAktif: true },
            select: {
                id: true,
                slug: true,
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                gambar: true,
                fasilitas: true,
                latitude: true,
                longitude: true,
                isAktif: true
            }
        });

        if (wisataList.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tidak ada wisata yang tersedia saat ini'
            });
        }

        // Get AI recommendation
        const preferences = {
            location: location || '',
            numPeople: parseInt(numPeople),
            maxPrice: maxPrice ? parseInt(maxPrice) : null
        };

        const recommendation = await getWisataRecommendation(preferences, wisataList);

        res.json(recommendation);
    } catch (error) {
        console.error('AI Recommendation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mendapatkan rekomendasi',
            error: error.message
        });
    }
}

module.exports = {
    getAllWisata,
    getWisataById,
    getWisataBySlug,
    createWisata,
    updateWisata,
    deleteWisata,
    getAIRecommendation
};