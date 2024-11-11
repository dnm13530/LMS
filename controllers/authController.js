// # Logic for user authentication (register, login, etc.)


const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { name, email, role, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO Users (name, email, role, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, role, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User registered successfully!' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    req.session.user_id = results[0].user_id;
    res.json({ message: 'Login successful!' });
  });
};
