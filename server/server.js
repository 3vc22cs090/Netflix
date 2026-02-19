const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const MOCK_DB_FILE = path.join(__dirname, 'users.json');

// Helper to manage mock DB
const getMockUsers = () => {
    if (!fs.existsSync(MOCK_DB_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(MOCK_DB_FILE));
    } catch (e) {
        return [];
    }
};

const saveMockUser = (user) => {
    const users = getMockUsers();
    users.push(user);
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(users, null, 2));
};

// Root route
app.get('/', (req, res) => {
    res.send('Auth Server Running');
});

// Registration logic
app.post('/api/register', async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        // Try real DB first
        try {
            const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await db.query(
                'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
                [name, email, hashedPassword, phone]
            );

            return res.status(201).json({ message: 'User registered successfully (Aiven DB)', user: newUser.rows[0] });
        } catch (dbErr) {
            console.error('Aiven DB Error (Falling back to Local):', dbErr.message);

            // Fallback to local JSON
            const users = getMockUsers();
            if (users.find(u => u.email === email)) {
                return res.status(400).json({ message: 'User already exists (Local)' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { id: Date.now(), name, email, password: hashedPassword, phone };
            saveMockUser(newUser);

            return res.status(201).json({
                message: 'User registered successfully (Local Fallback - Aiven DB is currently unreachable)',
                user: { id: newUser.id, name: newUser.name, email: newUser.email }
            });
        }
    } catch (err) {
        console.error('Fatal Registration Error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Login logic
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Try real DB first
        try {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
            }
        } catch (dbErr) {
            console.error('Aiven Login Fallback:', dbErr.message);
        }

        // Check Local JSON Fallback
        const users = getMockUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials or user not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (err) {
        console.error('Fatal Login Error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
