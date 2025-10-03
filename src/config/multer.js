const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirs = [
    'uploads/',
    'uploads/profileDesa/',
    'uploads/laporan/',
    'uploads/wisata/',
    'uploads/umkm/',
    'uploads/program/',
    'uploads/berita/'
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage untuk profil desa
const profileDesaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profileDesa/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profileDesa-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage umum
const generalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage untuk laporan
const laporanStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/laporan/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'laporan-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// storage untuk UMKM
const umkmStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/umkm/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'umkm-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// storage untuk wisata
const wisataStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/wisata/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'wisata-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// storage untuk program
const programStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/program/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'program-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter untuk gambar
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar!'), false);
    }
};

// Konfigurasi upload dengan limit ukuran
const uploadConfig = {
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: imageFilter
};

// Export multiple upload configurations
const upload = {
    general: multer({ 
        storage: generalStorage, 
        ...uploadConfig 
    }),
    profileDesa: multer({ 
        storage: profileDesaStorage, 
        ...uploadConfig 
    }),
    laporan: multer({ 
        storage: laporanStorage, 
        ...uploadConfig 
    }),
    umkm: multer({ 
        storage: umkmStorage, 
        ...uploadConfig 
    }),
    wisata: multer({ 
        storage: wisataStorage, 
        ...uploadConfig 
    }),
    program: multer({
        storage: programStorage,
        ...uploadConfig
    })
};

module.exports = upload;