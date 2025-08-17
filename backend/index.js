const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const helmet = require('helmet');

// routers & middlewares
const authRoutes = require('./routes/auth');      // assure-toi de l'importer
const candidateRoutes = require('./routes/candidate');
const calendarRoutes = require('./routes/calendar');
const feedBackRoutes = require('./routes/feedback');
const interviewRoutes = require('./routes/interview');
const { requireAuth } = require('./middlewares/auth');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Helmet + CORS
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // durcis en prod si besoin
}));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token'],
}));

//cookie-parser avant le csurf
app.use(cookieParser());

// body parser
app.use(express.json());

// session
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

// csurf — cookie mode (besoin de cookie-parser avant)
const csrfProtection = csrf({
    cookie: {
        key: 'csrfSecret',    // cookie interne (secret), lisible uniquement serveur
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
    }
});

// Endpoint pour initialiser le token côté client
// - csurf dépose un cookie secret httpOnly (csrfSecret)
// - on expose le token dans un cookie lisible XSRF-TOKEN + en JSON
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, {
        httpOnly: false,      // lisible côté front (double-submit cookie)
        sameSite: 'lax',
        secure: isProd,
    });
    return res.json({ csrfToken: token });
});

// Applique le CSRF UNIQUEMENT aux méthodes d’écriture sous /api
app.use('/api', (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    return csrfProtection(req, res, next);
});

// Les routes
app.use('/api', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/feedbacks', requireAuth, feedBackRoutes);
app.use('/api/interviews', requireAuth, interviewRoutes);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
