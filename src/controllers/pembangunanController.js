const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPembangunan = async (req, res) => {
    try {
        const Pembangunan = await prisma.programPembangunan.findMany({
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                kategori: true,
                anggaran: true,
                sumberDana: true,
                timeline: true,
                status: true,
                progress: true,
                foto: true,
                penanggungJawab: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.json({ success: true, data: Pembangunan, message: 'Berhasil mengambil data Program Pembangunan' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getPembangunanById = async (req, res) => {
    try {
        const { id } = req.params;
        const Pembangunan = await prisma.programPembangunan.findUnique({
            where: { id },
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                kategori: true,
                anggaran: true,
                sumberDana: true,
                timeline: true,
                status: true,
                progress: true,
                foto: true,
                penanggungJawab: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        res.json({ success: true, data: Pembangunan, message: "Berhasil mengambil data detail pembangunan"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createPembangunan = async(req, res) => {
    try {
        const { nama, deskripsi, kategori, anggaran, sumberDana, timeline, status, progress, foto, penanggungJawab } = req.body;
        const anggaranInt = anggaran ? parseInt(anggaran) : null;
        const progressInt = progress ? parseInt(progress) : 0;

        const pembangunan = await prisma.programPembangunan.create({
            data: { nama, deskripsi, kategori, anggaran: anggaranInt, sumberDana, timeline, status, progress: progressInt, foto: req.file ? `/uploads/program/${req.file.filename}` : null, penanggungJawab },
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                kategori: true,
                anggaran: true,
                sumberDana: true,
                timeline: true,
                status: true,
                progress: true,
                foto: true,
                penanggungJawab: true,
            }
        });
        res.status(201).json({ status: true, data: pembangunan, message: "Berhasil menambahkan program pembangunan"});
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan data Program pembangunan',
            error: error.message
        });
    }
}

const updatePembangunan = async(req, res) => {
    try {
        const { id } = req.params;
        const { nama, deskripsi, kategori, anggaran, sumberDana, timeline, status, progress, foto, penanggungJawab } = req.body;
        const anggaranInt = anggaran ? parseInt(anggaran) : null;
        const progressInt = progress ? parseInt(progress) : 0;
        const pembangunan = await prisma.programPembangunan.update({
            where: { id },
            data: { nama, deskripsi, kategori, anggaran: anggaranInt, sumberDana, timeline, status, progress: progressInt, foto: req.file ? `/uploads/program/${req.file.filename}` : null, penanggungJawab },
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                kategori: true,
                anggaran: true,
                sumberDana: true,
                timeline: true,
                status: true,
                progress: true,
                foto: true,
                penanggungJawab: true,
            }
        });
        res.json({ status: true, data: pembangunan, message: "Berhasil mengupdate program pembangunan"});
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat mengupdate data Program pembangunan',
            error: error.message
        });
    }
}

const deletePembangunan = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.programPembangunan.delete({
            where: { id }
        });
        res.json({ success: true, message: "Berhasil menghapus Data Pembangunan"});
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus data Program Pembangunan',
            error: error.message
        });
    }
}

module.exports = {
    getAllPembangunan,
    getPembangunanById,
    createPembangunan,
    updatePembangunan,
    deletePembangunan
}