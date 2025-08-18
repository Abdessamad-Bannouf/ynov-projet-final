const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const RAW_EXPIRES = (process.env.JWT_EXPIRES_IN || '1h').trim();

// Normalise: si nombre => int (secondes), sinon laisse la chaîne (ex: "1h", "7d")
const JWT_EXPIRES_IN = /^\d+$/.test(RAW_EXPIRES) ? parseInt(RAW_EXPIRES, 10) : RAW_EXPIRES;

// Petit garde-fou : refuse les valeurs manifestement invalides
const VALID_PATTERN = /^\d+$|^\d+[smhdwy]$/i; // ex: 60, 15m, 12h, 7d
if (!VALID_PATTERN.test(String(JWT_EXPIRES_IN))) {
    console.warn(`[auth] JWT_EXPIRES_IN invalide ("${RAW_EXPIRES}"), fallback "1h"`);
}

function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) return res.status(401).json({ message: 'Token manquant' });

        const payload = jwt.verify(token, JWT_SECRET);
        req.auth = { id: payload.id, email: payload.email, role: payload.role };
        next();
    } catch {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
}

function signAuthToken(payload) {
    const exp = VALID_PATTERN.test(String(JWT_EXPIRES_IN)) ? JWT_EXPIRES_IN : '1h';
    return jwt.sign(payload, JWT_SECRET, { expiresIn: exp });
}

module.exports = { requireAuth, signAuthToken };