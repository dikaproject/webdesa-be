const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllUmkm = async (req, res) => {
    try {
        const umkm = await prisma.uMKM.findMany({
            select: {
                id: true,
                slug: true,
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
                latitude: true,
                longitude: true,
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
        const { id } = req.params;
        const umkm = await prisma.uMKM.findUnique({
            where: { id },
            select: {
                id: true,
                slug: true,
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
                latitude: true,
                longitude: true,
                isAktif: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!umkm) {
            return res.status(404).json({ success: false, message: 'UMKM tidak ditemukan' });
        }
        res.json({ success: true, data: umkm });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data UMKM',
            error: error.message
        });
    }
}

const getUmkmBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const umkm = await prisma.uMKM.findFirst({
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
                latitude: true,
                longitude: true,
                isAktif: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!umkm) {
            return res.status(404).json({ success: false, message: 'UMKM tidak ditemukan' });
        }
        res.json({ success: true, data: umkm });
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

        const { nama, pemilik, deskripsi, kategori, alamat, kontak, produk, harga, jamBuka, jamTutup, latitude, longitude, isAktif } = req.body;
        
        // Generate slug from nama
        const slug = nama
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .trim();

        // Check if slug already exists
        const existingUmkm = await prisma.uMKM.findUnique({ 
            where: { slug } 
        });
        
        if (existingUmkm) {
            return res.status(400).json({ 
                success: false, 
                message: "Nama UMKM sudah digunakan, silakan gunakan nama lain"
            });
        }

        // Parse coordinates
        const lat = latitude && latitude.trim() !== '' ? parseFloat(latitude) : null;
        const lng = longitude && longitude.trim() !== '' ? parseFloat(longitude) : null;

        // Parse isAktif
        const isAktifBool = isAktif === 'true' || isAktif === true;

        const umkm = await prisma.uMKM.create({
            data: {
                slug,
                nama,
                pemilik,
                deskripsi,
                kategori,
                alamat,
                kontak: kontak || null,
                produk: produk || null,
                harga: harga || null,
                foto: req.file ? `/uploads/umkm/${req.file.filename}` : null,
                jamBuka: jamBuka || null,
                jamTutup: jamTutup || null,
                latitude: lat,
                longitude: lng,
                isAktif: isAktifBool
            }
        });


        res.status(201).json({ 
            success: true, 
            data: umkm, 
            message: "Data UMKM berhasil ditambahkan" 
        });
    } catch (error) {
        console.error('❌ Error creating UMKM:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat menambahkan data UMKM',
            error: error.message 
        });
    }
}

const updateUmkm = async (req, res) => {
    try {
        console.log('📝 Update UMKM - Request Body:', req.body);
        console.log('📷 Update UMKM - File:', req.file);

        const { id } = req.params;
        const { nama, pemilik, deskripsi, kategori, alamat, kontak, produk, harga, jamBuka, jamTutup, latitude, longitude, isAktif } = req.body;

        // Check if UMKM exists
        const existingUmkm = await prisma.uMKM.findUnique({ 
            where: { id } 
        });

        if (!existingUmkm) {
            return res.status(404).json({ 
                success: false, 
                message: "Data UMKM tidak ditemukan"
            });
        }

        // Parse coordinates
        const lat = latitude && latitude.trim() !== '' ? parseFloat(latitude) : undefined;
        const lng = longitude && longitude.trim() !== '' ? parseFloat(longitude) : undefined;

        // Parse isAktif
        const isAktifBool = isAktif === 'true' || isAktif === true;

        // Build update data object
        const updateData = {
            nama,
            pemilik,
            deskripsi,
            kategori,
            alamat,
            isAktif: isAktifBool
        };

        if (kontak !== undefined) updateData.kontak = kontak || null;
        if (produk !== undefined) updateData.produk = produk || null;
        if (harga !== undefined) updateData.harga = harga || null;
        if (jamBuka !== undefined) updateData.jamBuka = jamBuka || null;
        if (jamTutup !== undefined) updateData.jamTutup = jamTutup || null;
        if (req.file) updateData.foto = `/uploads/umkm/${req.file.filename}`;
        if (lat !== undefined) updateData.latitude = lat;
        if (lng !== undefined) updateData.longitude = lng;

        // Generate new slug if nama changed
        if (nama !== existingUmkm.nama) {
            const newSlug = nama
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .trim();
            
            // Check if new slug already exists (excluding current UMKM)
            const slugExists = await prisma.uMKM.findFirst({
                where: {
                    slug: newSlug,
                    NOT: { id: id }
                }
            });

            if (slugExists) {
                return res.status(400).json({
                    success: false,
                    message: "Nama UMKM sudah digunakan, silakan gunakan nama lain"
                });
            }

            updateData.slug = newSlug;
        }

        const umkm = await prisma.uMKM.update({
            where: { id },
            data: updateData
        });

        res.json({ 
            success: true, 
            data: umkm, 
            message: "Data UMKM berhasil diubah"
        });
    } catch (error) {
        console.error('❌ Error updating UMKM:', error);
        res.status(400).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengupdate UMKM',
            error: error.message
        });
    }
}

const deleteUmkm = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUmkm = await prisma.uMKM.findUnique({ 
            where: { id } 
        });
        
        if (!existingUmkm) {
            return res.status(404).json({ 
                success: false, 
                message: "Data UMKM tidak ditemukan" 
            });
        }
        
        await prisma.uMKM.delete({ where: { id } });
        
        res.json({ 
            success: true, 
            message: "Data UMKM berhasil dihapus" 
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus UMKM',
            error: error.message
        });
    }
}

module.exports = {
    getAllUmkm,
    getUmkmById,
    getUmkmBySlug,
    createUmkm,
    updateUmkm,
    deleteUmkm
};
