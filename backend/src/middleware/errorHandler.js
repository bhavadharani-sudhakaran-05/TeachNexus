/**
 * Global error handling middleware
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }
  
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  
  res.status(500).json({ message: 'Internal server error' });
};

module.exports = errorHandler;
