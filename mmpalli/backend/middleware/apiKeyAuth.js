// backend/middleware/apiKeyAuth.js
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.ADMIN_API_KEY;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized: API Key is missing. Add X-API-Key header.'
    });
  }

  if (apiKey !== validKey) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid API Key'
    });
  }

  next(); // If the key matches, let them through!
};

module.exports = apiKeyAuth;