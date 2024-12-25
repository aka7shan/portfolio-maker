// authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token to the request object
        console.log('In Auth Middleware ------>', req.user); // Debugging log
        next();
    } catch (err) {
        console.error('Token verification failed', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware; // Export the middleware
