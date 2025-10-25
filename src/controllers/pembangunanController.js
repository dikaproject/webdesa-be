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
        console.log('📝 Create Pembangunan - Request Body:', req.body);
        console.log('📷 Create Pembangunan - File:', req.file);

        const { nama, deskripsi, kategori, anggaran, sumberDana, timeline, status, progress, penanggungJawab } = req.body;
        
        // Parse anggaran dan progress
        const anggaranInt = anggaran && anggaran.trim() !== '' ? parseInt(anggaran, 10) : null;
        const progressInt = progress && progress.trim() !== '' ? parseInt(progress, 10) : 0;

        console.log('📊 Parsed Data:', {
            nama,
            anggaranInt,
            progressInt,
            hasFile: !!req.file
        });

        const pembangunan = await prisma.programPembangunan.create({
            data: { 
                nama, 
                deskripsi, 
                kategori, 
                anggaran: anggaranInt, 
                sumberDana: sumberDana || null, 
                timeline: timeline || null, 
                status, 
                progress: progressInt, 
                foto: req.file ? `/uploads/program/${req.file.filename}` : null, 
                penanggungJawab: penanggungJawab || null 
            },
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

        console.log('✅ Pembangunan created successfully:', pembangunan.id);

        res.status(201).json({ success: true, data: pembangunan, message: "Berhasil menambahkan program pembangunan"});
    } catch (error) {
        console.error('❌ Error creating pembangunan:', error);
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat menambahkan data Program pembangunan',
            error: error.message
        });
    }
}

const updatePembangunan = async(req, res) => {
    try {
        console.log('📝 Update Pembangunan - Request Body:', req.body);
        console.log('📷 Update Pembangunan - File:', req.file);

        const { id } = req.params;
        const { nama, deskripsi, kategori, anggaran, sumberDana, timeline, status, progress, penanggungJawab } = req.body;
        
        // Parse anggaran dan progress
        const anggaranInt = anggaran && anggaran.trim() !== '' ? parseInt(anggaran, 10) : undefined;
        const progressInt = progress && progress.trim() !== '' ? parseInt(progress, 10) : undefined;

        // Build update data object
        const updateData = {
            nama,
            deskripsi,
            kategori,
            status
        };

        // Add optional fields only if they have values
        if (anggaranInt !== undefined) updateData.anggaran = anggaranInt;
        if (sumberDana !== undefined) updateData.sumberDana = sumberDana || null;
        if (timeline !== undefined) updateData.timeline = timeline || null;
        if (progressInt !== undefined) updateData.progress = progressInt;
        if (penanggungJawab !== undefined) updateData.penanggungJawab = penanggungJawab || null;
        if (req.file) updateData.foto = `/uploads/program/${req.file.filename}`;

        console.log('📊 Update Data:', updateData);

        const pembangunan = await prisma.programPembangunan.update({
            where: { id },
            data: updateData,
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

        console.log('✅ Pembangunan updated successfully:', pembangunan.id);

        res.json({ success: true, data: pembangunan, message: "Berhasil mengupdate program pembangunan"});
    } catch (error) {
        console.error('❌ Error updating pembangunan:', error);
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