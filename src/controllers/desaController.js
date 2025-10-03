const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProfileDesa = async (req, res) => {
    try {
        const desa = await prisma.profilDesa.findFirst({
            select: {
                id: true,
                namaDesa: true,
                kecamatan: true,
                kabupaten: true,
                provinsi: true,
                kodePos: true,
                luasWilayah: true,
                visiMisi: true,
                sejarah: true,
                geografis: true,
                struktur: true,
                kontak: true,
                email: true,
                website: true,
                foto: true,
                createdAt: true,
                updatedAt: true
            }
        });
        
        if (!desa) {
            return res.status(404).json({ message: 'Profil desa tidak ditemukan' });
        }

        const jumlahPenduduk = await prisma.user.count({
            where: {
                role: 'WARGA'
            }
        });

        const totalUser = await prisma.user.count();
        const jumlahAdmin = await prisma.user.count({
            where: { role: 'ADMIN' }
        });
        const jumlahVisitor = await prisma.user.count({
            where: { role: 'VISITOR' }
        });
        
        res.json({
            success: true,
            data: {
                ...desa,
                jumlahPenduduk,
                statistik: {
                    totalUser,
                    jumlahWarga: jumlahPenduduk,
                    jumlahAdmin,
                    jumlahVisitor
                }
            }
        });
    } catch (error) {
        console.error('Error getting profil desa:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat mengambil profil desa',
            error: error.message 
        });
    }
};

const updateProfileDesa = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ 
                success: false,
                message: 'Hanya admin yang dapat mengupdate profil desa' 
            });
        }

        const {
            namaDesa,
            kecamatan,
            kabupaten,
            provinsi,
            kodePos,
            luasWilayah,
            visiMisi,
            sejarah,
            geografis,
            struktur,
            kontak,
            email,
            website
        } = req.body;

        const existingProfile = await prisma.profilDesa.findFirst();
        
        if (!existingProfile) {
            const newProfile = await prisma.profilDesa.create({
                data: {
                    namaDesa,
                    kecamatan,
                    kabupaten,
                    provinsi,
                    kodePos,
                    luasWilayah,
                    visiMisi,
                    sejarah,
                    geografis,
                    struktur,
                    kontak,
                    email,
                    website,
                    foto: req.file ? `/uploads/profileDesa/${req.file.filename}` : null
                }
            });
            
            return res.status(201).json({
                success: true,
                message: 'Profil desa berhasil dibuat',
                data: newProfile
            });
        } else {
            const updatedProfile = await prisma.profilDesa.update({
                where: { id: existingProfile.id },
                data: {
                    namaDesa,
                    kecamatan,
                    kabupaten,
                    provinsi,
                    kodePos,
                    luasWilayah: luasWilayah ? parseFloat(luasWilayah) : null,
                    visiMisi,
                    sejarah,
                    geografis,
                    struktur,
                    kontak,
                    email,
                    website,
                    foto: req.file ? `/uploads/profileDesa/${req.file.filename}` : existingProfile.foto
                }
            });
            
            return res.json({
                success: true,
                message: 'Profil desa berhasil diupdate',
                data: updatedProfile
            });
        }
    } catch (error) {
        console.error('Error updating profil desa:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat mengupdate profil desa',
            error: error.message 
        });
    }
};

const getStatistikDesa = async (req, res) => {
    try {
        const [
            totalUser,
            totalWarga,
            totalAdmin,
            totalVisitor,
            totalLaporan,
            laporanPending,
            laporanSelesai,
            totalWisata,
            totalUMKM,
            totalProgram
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'WARGA' } }),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.user.count({ where: { role: 'VISITOR' } }),
            prisma.laporan.count(),
            prisma.laporan.count({ where: { status: 'PENDING' } }),
            prisma.laporan.count({ where: { status: 'SELESAI' } }),
            prisma.wisataDesa.count({ where: { isAktif: true } }),
            prisma.uMKM.count({ where: { isAktif: true } }),
            prisma.programPembangunan.count()
        ]);

        res.json({
            success: true,
            data: {
                penduduk: {
                    totalUser,
                    totalWarga,
                    totalAdmin,
                    totalVisitor
                },
                laporan: {
                    total: totalLaporan,
                    pending: laporanPending,
                    selesai: laporanSelesai
                },
                wisata: {
                    total: totalWisata
                },
                umkm: {
                    total: totalUMKM
                },
                program: {
                    total: totalProgram
                }
            }
        });
    } catch (error) {
        console.error('Error getting statistik desa:', error);
        res.status(500).json({ 
            success: false,
            message: 'Terjadi kesalahan saat mengambil statistik desa',
            error: error.message 
        });
    }
};

module.exports = { 
    getProfileDesa,
    updateProfileDesa,
    getStatistikDesa
};