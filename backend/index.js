if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');
const calendarRoutes = require('./routes/calendar');
const feedBackRoutes = require('./routes/feedback');
const interviewRoutes = require('./routes/interview');

const { requireAuth } = require('./middlewares/auth');
const sanitizeAll = require('./middlewares/sanitize');

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(sanitizeAll);
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'change_me',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
    }
}));

// 1) Monte D’ABORD les routes publiques d’auth
app.use('/api', authRoutes); // /api/login, /api/register, /api/me

// 2) Prépare csurf en cookie mode
const csrfProtection = csrf({
    cookie: {
        key: 'csrfSecret', // secret httpOnly
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
    }
});

// 3) Endpoint pour récupérer le token côté client (dépose aussi XSRF-TOKEN lisible)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, {
        httpOnly: false, // lisible par le front
        sameSite: 'lax',
        secure: isProd,
    });
    return res.json({ csrfToken: token });
});

// 4) Applique CSRF aux méthodes d’écriture, en excluant login/register (et oauth callback)
app.use('/api', (req, res, next) => {
    // GET, HEAD, OPTIONS: pas de CSRF
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

    // Exclusions explicites
    const openWriteRoutes = [
        { method: 'POST', regexp: /^\/login$/ },
        { method: 'POST', regexp: /^\/register$/ },
        // Si ton callback OAuth fait un write, exclue-le aussi :
        { method: 'GET',  regexp: /^\/calendars\/oauth2callback$/ } // en général GET only
    ];
    if (openWriteRoutes.some(r => r.method === req.method && r.regexp.test(req.path))) {
        return next();
    }
    return csrfProtection(req, res, next);
});

// 5) Le reste des routes API (protégées par CSRF si write)
app.use('/api/candidates', candidateRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/feedbacks', requireAuth, feedBackRoutes);
app.use('/api/interviews', requireAuth, interviewRoutes);

app.get('/', (req, res) => res.send('Hello World!'));

// 6) Export de l'app + lancement (pas en test)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
module.exports = app;