const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');  // Import session middleware
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cv_project'  // Make sure this matches your MySQL DB
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to the database');
});

// Session Middleware
app.use(session({
    secret: 'your-secret-key',  // Use a strong secret key
    resave: false,
    saveUninitialized: true
}));

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { firstname, lastname, gender, contact, address, email, password } = req.body;

    if (!firstname || !lastname || !gender || !contact || !address || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO form (fname, lname, gender, contact, address, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [firstname, lastname, gender, contact, address, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Registration successful' });
            } else {
                res.json({ success: false, message: 'Registration failed' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error during registration' });
    }
});

// Login Endpoint (Example of how to use sessions)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        const query = 'SELECT * FROM form WHERE email = ? LIMIT 1';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found' });
            }

            const user = results[0];
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                req.session.email = email;  // Set session email upon successful login
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.status(400).json({ success: false, message: 'Incorrect password' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error during login' });
    }
});

// Route to save personal information (Another example)
app.post('/savePersonalInfo', (req, res) => {
    const { fullname, Email, Phonenumber, Birthdate, Gender, HomeAddress } = req.body;

    if (!fullname || !Email || !Phonenumber || !Birthdate || !Gender || !HomeAddress) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const query = 'INSERT INTO personal (fullname, Email, Phonenumber, Birthdate, Gender, HomeAddress) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [fullname, Email, Phonenumber, Birthdate, Gender, HomeAddress], (err, results) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.status(500).json({ success: false, message: 'Failed to save data.' });
        }

        // Respond with success message
        res.json({ success: true, message: 'Personal information saved successfully!' });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

