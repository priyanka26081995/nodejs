const express = require('express');
const router = express.Router();
const db = require('../database.js');
console.log(db)
// Respond with "Hello, World!" for requests to the root URL (/)
router.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Respond with "Hello, Express!" for requests to /hello
router.get('/hello', (req, res) => {
  res.send('Hello, Express!');
});

// Middleware function
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Route with middleware
router.get('/users', logger, (req, res) => {
  res.send('List of users');
});

router.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  res.json(`User IDs: ${userId}`);
});

//Templating
router.get('/register', (req, res) => {
    res.render('register');
});

// Error-handling middleware for specific error handling
router.get('/simulate-error', (req, res, next) => {
  // Simulate an error
  const err = new Error('Simulated Error');
  err.status = 500; // Set a custom error status
  
  // Pass the error to the next middleware
  next(err);
});

// CRUD

router.post('/api/users', (req, res) => {
  console.log('Received request body:', req.body);
  
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO tbl_users (username, email, password) VALUES (?, ?, ?)';
  
  console.log('Executing SQL:', sql, [username, email, password]);
  
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(400).send('Error creating user');
      return;
    }
    console.log('User created:', result);
    res.status(201).send('User created successfully');
  });
});

// Read Users
router.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM tbl_users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Error fetching users');
      return;
    }
    res.send(results);
  });
});

// Update User
router.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;
  const sql = 'UPDATE tbl_users SET username = ?, email = ?, password = ? WHERE id = ?';
  db.query(sql, [username, email, password, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(400).send('Error updating user');
      return;
    }
    console.log('User updated:', result);
    res.send('User updated successfully');
  });
});

// Delete User
router.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM tbl_users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting user');
      return;
    }
    console.log('User deleted:', result);
    res.send('User deleted successfully');
  });
});


module.exports = router;
