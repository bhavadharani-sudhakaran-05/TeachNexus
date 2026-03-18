/**
 * Rate limiting middleware
 */

const rateLimit = {};

const initRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimit[key]) {
      rateLimit[key] = { requests: [], blocked: false };
    }
    
    // Clean old requests outside window
    rateLimit[key].requests = rateLimit[key].requests.filter(t => now - t < windowMs);
    
    if (rateLimit[key].requests.length >= maxRequests) {
      rateLimit[key].blocked = true;
      return res.status(429).json({ message: 'Too many requests, please try again later' });
    }
    
    rateLimit[key].requests.push(now);
    next();
  };
};

module.exports = { initRateLimiter };
