process.env.NODE_ENV = 'test';

const path = require('path');
const envPath = path.join(__dirname, '..', '.env.test');
require('dotenv').config({ path: envPath });