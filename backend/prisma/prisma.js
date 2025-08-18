const path = require('path');
if (process.env.NODE_ENV === 'test') {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env.test') });
} else {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;