// controllers/auth.ts
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signAuthToken } = require('../middlewares/auth');

exports.postRegister = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'email et password requis' });
        }
        if (!role) {
            return res.status(400).json({ message: 'role requis (ex: ADMIN, RH, RECRUITER)' });
        }

        const existing = await User.findByEmail(email);
        if (existing) return res.status(400).json({ message: 'Utilisateur déjà existant' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const created = await User.create({
            email,
            password: hashedPassword,
            role
        });

        const token = signAuthToken({ id: created.id, email: created.email, role: created.role });

        return res.status(201).json({
            message: 'Utilisateur créé',
            token,
            user: { id: created.id, email: created.email, role: created.role }
        });
    } catch (e) {
        console.error('postRegister error:', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const current = await User.findByEmail(email);
        if (!current) return res.status(400).json({ message: 'Utilisateur non trouvé' });

        const valid = await bcrypt.compare(password, current.password);
        if (!valid) return res.status(400).json({ message: 'Mot de passe invalide' });

        const token = signAuthToken({ id: current.id, email: current.email, role: current.role });

        return res.status(200).json({
            message: 'Utilisateur connecté',
            token,
            user: { id: current.id, email: current.email, role: current.role }
        });
    } catch (e) {
        console.error('postLogin error:', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Petit endpoint pour récupérer le profil courant
exports.me = async (req, res) => {
    try {
        // req.auth alimenté par requireAuth
        const { id } = req.auth;
        const me = await User.findById(id);
        if (!me) return res.status(404).json({ message: 'Utilisateur introuvable' });
        return res.json({ id: me.id, email: me.email, role: me.role });
    } catch (e) {
        console.error('me error:', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};
