import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

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
  console.log('Connected to MySQL database');
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.',
})
app.use(limiter);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

// Add test route to verify server is running
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Register
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

//Login
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Retrieve all blog posts
app.get('/posts', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM blog_tbl';
  
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      res.status(200).json(results);
    });
  });

// Retrieve specific blog post
app.get('/posts/:id', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM blog_tbl WHERE id = ?';
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(results[0]);
  });
});

// Create new post
app.post('/posts', authenticateToken, (req, res) => {
  const { title, content, author } = req.body;
  const sql = 'INSERT INTO blog_tbl (title, content, author) VALUES (?, ?, ?)';
  connection.query(sql, [title, content, author], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(201).json({ message: 'Post created', postId: result.insertId });
  });
});

// Update existing post
app.put('/posts/:id', authenticateToken, (req, res) => {
  const { title, content, author } = req.body;
  const sql = 'UPDATE blog_tbl SET title = ?, content = ?, author = ? WHERE id = ?';
  connection.query(sql, [title, content, author, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post updated' });
  });
});

// Delete a post
app.delete('/posts/:id', authenticateToken, (req, res) => {
  const sql = 'DELETE FROM blog_tbl WHERE id = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json({ message: 'Post deleted' });
  });
});






