import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

/* Check JWT Token */
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      /* Verify Token */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      /* Get User Details */
      req.user = await User.findById(decoded.id).select('-password');

      /* Continue Request */
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
/* Optional Authentication */
export const optionalAuth = async (req, res, next) => {
  if (req.cookies && req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      /* Continue as Guest */
      req.user = null;
    }
  } else {
    /* Guest User */
    req.user = null; 
  }

  next();
};