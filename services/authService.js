// Secret key for JWT
const secretKey = '1234567890'; // Replace with a long, randomly generated string
const jwt = require('jsonwebtoken');

// Sample user data (in real application, this would come from a database)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];

    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];

        // Verify token
        jwt.verify(bearerToken, secretKey, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    // JWT malformed, expired, etc.
                    console.error('Token verification failed:', err.message);
                    return res.status(403).json({ error: 'Token is invalid' }); // Token is invalid
                } else if (err.name === 'TokenExpiredError') {
                    // JWT expired
                    console.error('Token verification failed:', err.message);
                    return res.status(403).json({ error: 'Token has expired' }); // Token has expired
                } else {
                    // Other errors
                    console.error('Token verification failed:', err.message);
                    return res.status(403).json({ error: 'Token verification failed' }); // General token verification error
                }
            }
            // Token is valid, store decoded token in request object
            req.token = decoded;
            next(); // Next middleware
        });
    } else {
        // Unauthorized if Authorization header is missing
        res.sendStatus(401); // Unauthorized
    }
}

module.exports = {
    authenticateUser,
    verifyToken,
    secretKey
};