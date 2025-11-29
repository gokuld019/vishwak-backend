// middleware/authMiddleware.js
const { verifyAccessToken } = require('../utils/jwt');

module.exports = (requiredRoles = []) => (req, res, next) => {
  try {
    // support Authorization: Bearer <token> or accessToken cookie
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    else if (req.cookies && req.cookies.access_token) token = req.cookies.access_token;

    if (!token) return res.status(401).json({ message: 'No access token provided' });

    const payload = verifyAccessToken(token);
    req.admin = payload;

    if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
};
