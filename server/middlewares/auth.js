const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
const jwtAuthMiddleware = (req, res, next) => {
  // Check if Authorization header is present
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: 'Token Not Found' });
  }

  // Extract the token from "Bearer <token>"
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Function to generate JWT token from user data
const generateToken = (userData) => {
  return jwt.sign(  
      userData,
      process.env.JWT_SECRET,
      { expiresIn: 30000 }
  ); // Token expires in 30 seconds
};

module.exports = {
  jwtAuthMiddleware,
  generateToken,
};
