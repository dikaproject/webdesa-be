const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getWisataRecommendation } = require('../config/ai');

const getAllWisata = async (req, res) => {
    try {
        const wisata = await prisma.wisataDesa.findMany({
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
        const wisata = await prisma.wisataDesa.findUnique({
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
        const wisata = await prisma.wisataDesa.findFirst({
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
        const { nama, deskripsi, lokasi, kategori, harga, jamBuka, jamTutup, kontak, fasilitas, latitude, longitude, isAktif } = req.body;
        
        const slug = nama
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .trim();
        
        const hargaInt = harga && harga.trim() !== '' ? parseInt(harga, 10) : null;
        const lat = latitude && latitude.trim() !== '' ? parseFloat(latitude) : null;
        const lng = longitude && longitude.trim() !== '' ? parseFloat(longitude) : null;
        
        let fasilitasArray = [];
        
        try {
            if (fasilitas && fasilitas.trim() !== '') {
                fasilitasArray = typeof fasilitas === 'string' ? JSON.parse(fasilitas) : fasilitas;
            }
        } catch (e) {
            fasilitasArray = [];
        }

        const isAktifBool = isAktif === 'true' || isAktif === true;
        
        const foto = req.files && req.files.length > 0 ? `/uploads/wisata/${req.files[0].filename}` : null;
        const gambarArray = req.files && req.files.length > 1 
            ? req.files.slice(1).map(f => `/uploads/wisata/${f.filename}`)
            : [];

        const wisata = await prisma.wisataDesa.create({
            data: { 
                slug,
                nama, 
                deskripsi, 
                lokasi, 
                kategori: kategori || null, 
                harga: hargaInt,
                jamBuka: jamBuka || null, 
                jamTutup: jamTutup || null, 
                kontak: kontak || null, 
                foto,
                gambar: gambarArray,
                fasilitas: fasilitasArray,
                latitude: lat,
                longitude: lng,
                isAktif: isAktifBool
            }
        });
        
        res.status(201).json({ 
            success: true, 
            data: wisata, 
            message: 'Berhasil menambahkan data Wisata Desa' 
        });
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
        
        const hargaInt = harga && harga.trim() !== '' ? parseInt(harga, 10) : undefined;
        const lat = latitude && latitude.trim() !== '' ? parseFloat(latitude) : undefined;
        const lng = longitude && longitude.trim() !== '' ? parseFloat(longitude) : undefined;
        
        let gambarArray;
        let fasilitasArray;
        
        try {
            if (gambar !== undefined && gambar !== null && gambar.trim() !== '') {
                gambarArray = typeof gambar === 'string' ? JSON.parse(gambar) : gambar;
            }
        } catch (e) {
            gambarArray = undefined;
        }
        
        try {
            if (fasilitas !== undefined && fasilitas !== null && fasilitas.trim() !== '') {
                fasilitasArray = typeof fasilitas === 'string' ? JSON.parse(fasilitas) : fasilitas;
            }
        } catch (e) {
            fasilitasArray = undefined;
        }

        const isAktifBool = isAktif === 'true' || isAktif === true;

        const updateData = {
            nama, 
            deskripsi, 
            lokasi, 
            kategori: kategori || null,
            isAktif: isAktifBool
        };

        if (hargaInt !== undefined) updateData.harga = hargaInt;
        if (jamBuka !== undefined) updateData.jamBuka = jamBuka || null;
        if (jamTutup !== undefined) updateData.jamTutup = jamTutup || null;
        if (kontak !== undefined) updateData.kontak = kontak || null;
        
        if (req.files && req.files.length > 0) {
            updateData.foto = `/uploads/wisata/${req.files[0].filename}`;
            if (req.files.length > 1) {
                const newGambar = req.files.slice(1).map(f => `/uploads/wisata/${f.filename}`);
                updateData.gambar = gambarArray ? [...gambarArray, ...newGambar] : newGambar;
            }
        } else if (gambarArray !== undefined) {
            updateData.gambar = gambarArray;
        }
        
        if (fasilitasArray !== undefined) updateData.fasilitas = fasilitasArray;
        if (lat !== undefined) updateData.latitude = lat;
        if (lng !== undefined) updateData.longitude = lng;
        
        const wisata = await prisma.wisataDesa.update({
            where: { id },
            data: updateData
        });
        
        res.json({ 
            success: true, 
            data: wisata, 
            message: 'Berhasil mengupdate data Wisata Desa' 
        });
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
        await prisma.wisataDesa.delete({
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

        if (!numPeople || numPeople < 1) {
            return res.status(400).json({
                success: false,
                message: 'Jumlah orang harus minimal 1'
            });
        }

        const wisataList = await prisma.wisataDesa.findMany({
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