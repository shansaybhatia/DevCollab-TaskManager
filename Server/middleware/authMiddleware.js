const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers?.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: 'Not Authorized, no token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'devcollab_default_jwt_secret_key';
    const decoded = jwt.verify(token, jwtSecret);

    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
