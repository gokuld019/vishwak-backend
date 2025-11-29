// controllers/authController.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Admin = require('../models/Admin');
const RefreshToken = require('../models/RefreshToken');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 30 days

function cookieOptions(req) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  };
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    if (!admin.isActive) return res.status(403).json({ message: 'Account disabled' });

    const matched = await bcrypt.compare(password, admin.password);
    if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: admin.id, email: admin.email, role: admin.role };
    const accessToken = signAccessToken(payload);

    // create refresh token, store in DB
    const jti = uuidv4(); // unique id
    const refreshToken = signRefreshToken({ id: admin.id, jti });
    const expiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE);

    await RefreshToken.create({
      token: refreshToken,
      adminId: admin.id,
      expiresAt,
      ip: req.ip,
      userAgent: req.get('User-Agent') || null
    });

    // send cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...cookieOptions(req),
      maxAge: REFRESH_COOKIE_MAX_AGE
    });

    // return access token (frontend stores in memory / local state)
    return res.json({
      accessToken,
      admin: { id: admin.id, email: admin.email, role: admin.role }
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    // find DB token
    const dbToken = await RefreshToken.findOne({ where: { token, revoked: false }});
    if (!dbToken) return res.status(401).json({ message: 'Refresh token invalid or revoked' });

    // verify token
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      // token invalid/expired - revoke DB token
      dbToken.revoked = true;
      await dbToken.save();
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // rotate: revoke old, issue new refresh token
    dbToken.revoked = true;
    await dbToken.save();

    const newJti = uuidv4();
    const newRefreshToken = signRefreshToken({ id: payload.id, jti: newJti });
    const expiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE);

    await RefreshToken.create({
      token: newRefreshToken,
      adminId: payload.id,
      expiresAt,
      ip: req.ip,
      userAgent: req.get('User-Agent') || null
    });

    const newAccessToken = signAccessToken({ id: payload.id, email: payload.email, role: payload.role });

    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, {
      ...cookieOptions(req),
      maxAge: REFRESH_COOKIE_MAX_AGE
    });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;
    if (token) {
      await RefreshToken.update({ revoked: true }, { where: { token }});
    }
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/', domain: process.env.COOKIE_DOMAIN || undefined });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
