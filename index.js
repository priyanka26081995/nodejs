// app.js

const express = require('express');
const routes = require('./routes/apiroutes'); // Import routes file
const jwtRoutes = require('./routes/jwt-routes'); // Import routes file

const app = express();
const port = 9000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to parse JSON bodies
app.use(express.json());

// Use the routes defined in routes.js
app.use('/', routes);
app.use('/jwt', jwtRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // Default status code is 500 Internal Server Error if not set
  const status = err.status || 500;
  
  // Send a JSON response with the error details
  res.status(status).json({
    error: {
      message: err.message,
    },
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
