const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUmkm = async (req, res) => {
    try {
        const umkm = await prisma.UMKM.findMany({
            select : {
                id: true,
                nama: true,
                pemilik: true,
                deskripsi: true,
                kategori: true,
                alamat: true,
                kontak: true,
                produk: true,
                harga: true,
                foto: true,
                jamBuka: true,
                jamTutup: true,
                isAktif: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json({ success: true, data: umkm, message: 'Berhasil mengambil data UMKM' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data UMKM',
            error: error.message
        });
    }
}

const getUmkmById = async (req, res) => {
    try {
        const { id } = req.params 
        const umkm = await prisma.UMKM.findUnique({
            where: { id },
            select: {
                id: true,
                nama: true,
                pemilik: true,
                deskripsi: true,
                kategori: true,
                alamat: true,
                kontak: true,
                produk: true,
                harga: true,
                foto: true,
                jamBuka: true,
                jamTutup: true,
                isAktif: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!umkm) {
            return res.status(404).json({ success: false, message: 'UMKM tidak ditemukan' });
        }
        res.json({ success: true, data: umkm, message: 'Berhasil mengambil data UMKM' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data UMKM',
            error: error.message
        });
    }
}

const createUmkm = async (req, res) => {
    try {
        const { nama, pemilik, deskripsi, kategori, alamat, kontak, produk, harga, foto, jamBuka, jamTutup, isAktif } = req.body;
        const existingUmkm = await prisma.UMKM.findUnique({ where: { nama } });
        if (existingUmkm) {
            return res.status(400).json({ success: false, message: "Nama Usaha sudah di daftarkan"});
        }
        const umkm = await prisma.UMKM.create({
            data: { nama, pemilik, deskripsi, kategori, alamat, kontak, produk, harga, foto: req.file ? `/uploads/umkm/${req.file.filename}` : null, jamBuka, jamTutup, isAktif },
            select: {
                id: true,
                nama: true,
                pemilik: true,
                deskripsi: true,
                kategori: true,
                alamat: true,
                kontak: true,
                produk: true,
                harga: true,
                foto: true,
                jamBuka: true,
                jamTutup: true,
                isAktif: true
            }
        });
        res.status(201).json({ success: true, data:umkm, message: "data Umkm berhasil di tambahkan" })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const updateUmkm = async(req, res) => {
    try {
        const { id } = req.params;
        const { nama, pemilik, deskripsi, kategori, alamat, kontak, produk, harga, foto, jamBuka, jamTutup, isAktif } = req.body;
        const existingUmkm = await prisma.UMKM.findUnique({ where: { id } });

        if (!existingUmkm) {
            return res.status(404).json({ success: false, message: "Data Umkm tidak di temukan"});
        }
        const umkm = await prisma.UMKM.update({
            where: { id },
            data: { nama, pemilik, deskripsi, kategori, alamat, kontak, produk, harga, foto: req.file ? `/uploads/umkm/${req.file.filename}` : null, jamBuka, jamTutup, isAktif },
            select: {
                id: true,
                nama: true,
                pemilik: true,
                deskripsi: true,
                kategori: true,
                alamat: true,
                kontak: true,
                produk: true,
                harga: true,
                foto: true,
                jamBuka: true,
                jamTutup: true,
                isAktif: true
            }
        });
        res.json({ success: true, data: umkm, message: "Data Umkm berhasil di ubah"})
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengupdate umkm',
            error: error.message
        });
    }
}

const deleteUmkm = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUmkm = await prisma.UMKM.findUnique({ where: { id } });
        if (!existingUmkm) {
            return res.status(404).json({ success: false, message: "Data Umkm tidak di temukan" });
        }
        await prisma.UMKM.delete({ where: { id } });
        res.json({ success: true, message: "Data Umkm berhasil di hapus" });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus umkm',
            error: error.message
        });
    }
}

module.exports = {
    getAllUmkm,
    getUmkmById,
    createUmkm,
    updateUmkm,
    deleteUmkm
};
