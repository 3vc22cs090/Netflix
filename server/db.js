const { Pool } = require('pg');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.trim(),
    ssl: {
        rejectUnauthorized: false,
    }
});

pool.on('connect', () => {
    console.log('Connected to Aiven DB');
});

pool.on('error', (err) => {
    console.error('Error connecting to Aiven DB', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
