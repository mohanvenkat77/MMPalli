// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose duplicate key error (e.g., trying to add a phone number that already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: `Duplicate value for ${field}: "${err.keyValue[field]}" already exists`
    });
  }

  // Mongoose validation error (e.g., missing required fields)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;