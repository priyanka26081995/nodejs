// Import necessary modules
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateUser, verifyToken, secretKey } = require('../services/authService');

// Login endpoint to generate JWT token
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Validate username and password
    const user = authenticateUser(username, password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

    // Respond with token
    res.json({ token });
});

// Protected endpoint to access protected resource
router.get('/verify', verifyToken, (req, res) => {
    // If token verification is successful, send protected data
     res.json({ message: 'Protected data accessed successfully', user: req.token });
});

module.exports = router;