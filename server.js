const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database Connection
let db;
async function connectDB() {
    try {
        db = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('Connected to MySQL Database');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('V-SHINE Backend API with MySQL is running...');
});

// Newsletter Subscription
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    try {
        await db.execute('INSERT INTO subscriptions (email) VALUES (?)', [email]);
        console.log(`New subscription: ${email}`);
        res.json({ success: true, message: 'Subscribed successfully!' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ success: true, message: 'Already subscribed!' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        await db.execute(
            'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );
        console.log(`New contact message from ${name}: ${subject}`);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Products API
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
