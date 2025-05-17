import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // load .env file

const app = express();
const port = process.env.PORT || 5000;
const saltRounds = 10;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pblog_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL database');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

// ➕ Add test route to verify server is running
app.get('/ping', (req, res) => {
  res.send('pong');
});

// ✅ REGISTER ROUTE
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    connection.query(
      'INSERT INTO user (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists' });
          }
          return res.status(500).json({ message: 'Database error', error: err });
        }

        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

//Login a user
// LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    connection.query(
      'SELECT * FROM user WHERE username = ?',
      [username],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
  
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        const user = results[0];
  
        // Compare the password with the hashed password stored in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        // Create JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
  
        res.json({ message: 'Login successful', token });
      }
    );
  });
  
//Retrieve all blog posts
app.get('/posts', authenticateToken, (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });

// Retrieve specific blog
app.get('/posts/:id', authenticateToken, (req, res) => {
    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).send({ message: 'Post not found' });
      res.json(results[0]);
    });
  });

  

