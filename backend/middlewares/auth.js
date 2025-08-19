// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const RAW_EXPIRES = (process.env.JWT_EXPIRES_IN || '1h').trim();
const VALID_PATTERN = /^\d+$|^\d+[smhdwy]$/i;
const JWT_EXPIRES_IN = VALID_PATTERN.test(RAW_EXPIRES) ? RAW_EXPIRES : '1h';

function normalizeId(payload) {
    // Accepte id | userId | sub (string ou number)
    if (payload?.id != null) return Number(payload.id);
    if (payload?.userId != null) return Number(payload.userId);
    if (payload?.sub != null) return Number(payload.sub);
    return undefined;
}

function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const m = authHeader.match(/^Bearer (.+)$/i);
        if (!m) return res.status(401).json({ message: 'Token manquant' });

        const token = m[1];
        const payload = jwt.verify(token, JWT_SECRET);

        const id = normalizeId(payload);
        if (!id) return res.status(401).json({ message: 'Payload JWT invalide (id absent).' });

        const user = { id, email: payload.email, role: payload.role };
        // ✅ Compatibilité avec tous les contrôleurs
        req.user = user;
        req.auth = user;

        return next();
    } catch (e) {
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
}

function signAuthToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

module.exports = { requireAuth, signAuthToken };
