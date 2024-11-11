require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const db = require('./config/db');  // MySQL connection
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');


app.use(express.json());
app.use(cors());

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Classroom Management System API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//const session = require('express-session');
