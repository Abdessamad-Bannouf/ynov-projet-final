const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { setupSwagger } = require('./doc/swagger');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const candidateRoutes = require('./routes/candidate');
const calendarRoutes = require('./routes/calendar');
const feedBackRoutes = require('./routes/feedback')
const interviewRoutes = require('./routes/interview');

const app = express()
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    next()
})
app.use(express.json());
app.use(session({
    secret: '123', // TODO: à remplacer par un vrai secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // `true` si HTTPS
}));

// Swagger doc api
setupSwagger(app);

// Routes
app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/calendars', calendarRoutes);
app.use('/api/feedbacks', feedBackRoutes);
app.use('/api/interviews', interviewRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})