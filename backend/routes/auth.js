const express = require('express');
const router = express.Router();
const connection = require('../db'); // Go up one directory level to find 'db.js' // Assuming db.js is in the same directory or adjust path
const bcrypt = require('bcrypt'); // <--- IMPORT BCROYPT HERE

// Signup (Highly recommend updating this to hash password before saving!)
router.post('/signup', async (req, res) => { // Make it async because bcrypt.hash is async
    const { firstName, lastName, email, cnic, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const sql = 'INSERT INTO users (first_name, last_name, email, cnic, password) VALUES (?, ?, ?, ?, ?)';

        connection.query(sql, [firstName, lastName, email, cnic, hashedPassword], (err, result) => {
            if (err) {
                console.error('Signup error:', err);
                // Check for duplicate entry error (e.g., email unique constraint)
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Email or CNIC already registered.' });
                }
                return res.status(500).json({ error: 'Signup failed. Please try again.' });
            }
            res.status(201).json({ message: 'Signup successful! Please log in.' }); // Use 201 for resource creation
        });
    } catch (hashError) {
        console.error('Password hashing error:', hashError);
        return res.status(500).json({ error: 'Could not process password.' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // --- CHANGE THIS LINE ---
    // Select id, email, first_name, last_name, and password from the users table
    const sql = 'SELECT id, email, first_name, last_name, password FROM users WHERE email = ?';

    connection.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database error during login query:', err);
            return res.status(500).json({ error: 'Server error during login.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Login successful! Send back the user's ID and other info
        res.status(200).json({
            message: 'Login successful',
            userId: user.id,
            // --- CHANGE THESE LINES ---
            // Send back first_name and last_name instead of username
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email
        });
    });
});

module.exports = router;