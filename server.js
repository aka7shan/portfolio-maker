// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const cors = require('cors');

const path = require('path');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend's origin
}));
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
