const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid token.' 
    });
  }
};

// ✅ NEW: Optional Auth Middleware (untuk guest checkout)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, name: true, role: true }
        });

        if (user) {
          req.user = user;
        }
      } catch (err) {
        // Token invalid, continue as guest
        console.log('Invalid token, continuing as guest');
      }
    }

    // Always continue (guest or logged-in)
    next();
  } catch (error) {
    // Continue as guest on any error
    next();
  }
};

const adminOnly = async (req, res, next) => {
  try {
    // Jalankan auth middleware dulu
    await auth(req, res, () => {
      // Cek apakah user adalah admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied. Admin only.' 
        });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed.' 
    });
  }
};

module.exports = { auth, adminOnly, optionalAuth };