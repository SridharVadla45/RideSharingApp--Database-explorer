// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    // console.log('Cookies:', req.cookies); // Debug
    // console.log('Cookies:', req.cookies); // Debug

    // Check cookie if header is missing
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        // If browser request, redirect to login
        if (req.accepts('html') && !req.is('json')) {
            return res.redirect('/auth/login');
        }
        return res.status(401).json({ error: 'Access token missing' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // attach user info to request
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        // If browser request, redirect to login
        if (req.accepts('html') && !req.is('json')) {
            return res.redirect('/auth/login');
        }
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
