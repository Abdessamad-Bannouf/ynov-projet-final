const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Vérifie le JWT, enrichit req.auth { id, email, role }
function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

        if (!token) return res.status(401).json({ message: 'Token manquant' });

        const payload = jwt.verify(token, JWT_SECRET);
        // payload: { id, email, role, iat, exp }
        req.auth = { id: payload.id, email: payload.email, role: payload.role };
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
}

// Générateur de token (utile dans controller auth)
function signAuthToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

module.exports = { requireAuth, signAuthToken };
