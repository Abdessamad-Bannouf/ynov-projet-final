const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const candidateRoutes = require('./routes/candidate');
const calendarRoutes = require('./routes/calendar');

const app = express()
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3000', // ou l'URL de ton front
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: '123', // TODO: à remplacer par un vrai secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // `true` si HTTPS
}));

// Routes
app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/calendar', calendarRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})