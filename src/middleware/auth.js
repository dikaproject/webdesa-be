const { verifyToken } = require('../utils/jwt');

const auth = async (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers['authorization'];
    
    // Check if auth header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Get token from header
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminOnly };