const { Pool } = require('pg');
require('dotenv').config();
const dbUrl = process.env.DATABASE_URL?.trim();

if (!dbUrl) {
    if (process.env.VERCEL) {
        throw new Error('DATABASE_URL environment variable is missing. Please add it to your Vercel project settings.');
    }
    console.warn('Warning: DATABASE_URL is not defined. Defaulting to local connection (likely to fail in production).');
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
    connectionString: dbUrl,
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
