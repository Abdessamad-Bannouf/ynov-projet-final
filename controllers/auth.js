const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');

const JWT_SECRET = 'votre_cle_secrete';

// Inscription
exports.postRegister = async (req, res, next) => {
    const { email, password, role } = req.body;

    // Vérifier si l’utilisateur existe déjà
    //const existingUser = users.find(u => u.email === email);
    const existingUser = await user.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant' });

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l’utilisateur
    const newUser = {
        email,
        password: hashedPassword
    };

    await user.create({"email": email, "password": hashedPassword, "role": role});

    // Générer le token
    //const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Utilisateur créé', token });
};



// Connexion
exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const currentUser = await user.findByEmail(email);
    if (!currentUser) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const validPassword = await bcrypt.compare(password, currentUser.password);
    if (!validPassword) return res.status(400).json({ message: 'Mot de passe invalide' });

    if(validPassword) {
        //const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        const token = jwt.sign({ id: currentUser.id, email: currentUser.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Utilisateur connecté', token });
    }
};