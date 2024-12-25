// routes/auth.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');
const router = express.Router();


// // Middleware for token verification
// const authMiddleware = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Token decoded successfully:', decoded);
//         req.user = decoded; // Attach the decoded token data to the request object
//         console.log('In Auth0000------>',req.user)
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Token is valid', userId: req.user.userId });
});



// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, email, password });
        await user.save();

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ userName : user.username ,token : token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
