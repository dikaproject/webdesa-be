const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllWisata = async (req, res) => {
    try {
        const wisata = await prisma.WisataDesa.findMany({
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                rating: true,
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
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                rating: true,
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
        const { nama, deskripsi, lokasi, kategori, harga, rating, jamBuka, jamTutup, kontak, isAktif } = req.body;
        
        const hargaInt = harga ? parseInt(harga) : null;
        const ratingFloat = rating ? parseFloat(rating) : null;
        const wisata = await prisma.WisataDesa.create({
            data: { nama, deskripsi, lokasi, kategori, harga: hargaInt, rating: ratingFloat, jamBuka, jamTutup, kontak, foto: req.file ? `/uploads/wisata/${req.file.filename}` : null, isAktif },
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                rating: true,
                isAktif: true,
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
        const { nama, deskripsi, lokasi, kategori, harga, jamBuka, jamTutup, kontak, isAktif } = req.body;
        const wisata = await prisma.WisataDesa.update({
            where: { id },
            data: { nama, deskripsi, lokasi, kategori, harga, jamBuka, jamTutup, kontak, foto: req.file ? `/uploads/wisata/${req.file.filename}` : undefined, isAktif },
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                lokasi: true,
                kategori: true,
                harga: true,
                jamBuka: true,
                jamTutup: true,
                kontak: true,
                foto: true,
                rating: true,
                isAktif: true,
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

module.exports = {
    getAllWisata,
    getWisataById,
    createWisata,
    updateWisata,
    deleteWisata
};