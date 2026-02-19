const db = require('./db');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const setupDatabase = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database table "users" created or already exists.');
        process.exit(0);
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    }
};

setupDatabase();
