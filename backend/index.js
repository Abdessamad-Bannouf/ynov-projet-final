const express = require('express');
const cors = require('cors');

const authRoutes = require('../../toto/backend/routes/auth');
const protectedRoutes = require('../../toto/backend/routes/protected');
const candidateRoutes = require('../../toto/backend/routes/candidate');
const calendarRoutes = require('../../toto/backend/routes/calendar')

const app = express()
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

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