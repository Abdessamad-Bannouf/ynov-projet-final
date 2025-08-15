function requireRole(...allowed) {
    return (req, res, next) => {
        if (!req.auth) return res.status(401).json({ message: 'Non authentifié' });
        if (!allowed.includes(req.auth.role)) {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        next();
    };
}

function requireSelfOrRole(paramName, ...allowed) {
    return (req, res, next) => {
        if (!req.auth) return res.status(401).json({ message: 'Non authentifié' });

        const isSelf = Number(req.params[paramName]) === Number(req.auth.id);
        const isAllowed = allowed.includes(req.auth.role);

        if (!isSelf && !isAllowed) {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        next();
    };
}

module.exports = { requireRole, requireSelfOrRole };