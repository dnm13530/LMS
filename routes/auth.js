// # Auth routes (login, register)

const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Your MySQL database connection
const router = express.Router();

// POST /register route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if the email is already registered
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      // Create JWT token
      const token = jwt.sign({ userId: result.insertId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({
        message: 'User registered successfully',
        token,
      });
    });
  });
});

module.exports = router;
