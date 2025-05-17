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
// // Retrieve specific blog post
// app.get('/posts/:id', authenticateToken, (req, res) => {
//     db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
//       if (err) return res.status(500).send(err);
//       if (results.length === 0) return res.status(404).send({ message: 'Post not found' });
//       res.json(results[0]);
//     });
//   });

// // Create new blog post
// app.post('/posts', authenticateToken, (req, res) => {
//     const { title, content, author } = req.body;
//     const sql = 'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)';
//     db.query(sql, [title, content, author], (err, result) => {
//       if (err) return res.status(500).send(err);
//       res.status(201).json({ id: result.insertId, title, content, author });
//     });
//   });

// // Update an existing blog post
// app.put('/posts/:id', authenticateToken, (req, res) => {
//     const { title, content, author } = req.body;
//     const sql = 'UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?';
//     db.query(sql, [title, content, author, req.params.id], (err) => {
//       if (err) return res.status(500).send(err);
//       res.json({ id: req.params.id, title, content, author });
//     });
//   });

// // Delete blog post
// app.delete('/posts/:id', authenticateToken, (req, res) => {
//     db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err) => {
//       if (err) return res.status(500).send(err);
//       res.json({ message: 'Post has been deleted', id: req.params.id });
//     });
//   });



