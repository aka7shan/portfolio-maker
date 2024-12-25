const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const authMiddleware = require('./authMiddleware');
const Video = require('../models/Video');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/videos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/videos/upload
router.post('/upload', authMiddleware, upload.single('video'), async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user; // Extract user ID from token
  const videoFile = req.file;

  if (!videoFile) {
    return res.status(400).json({ message: 'No video file uploaded!' });
  }
  const relativePath = path.relative(path.resolve(__dirname, '../'), videoFile.path);
  try {
    const video = new Video({
      title,
      description,
      filePath: relativePath,
      user: userId,
    });

    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully!', video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' })}

  // Save video metadata to a database if needed
  
});


// GET /api/videos/my-videos
router.get('/my-videos', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user; // Extract userId from authMiddleware

    // Find videos associated with the userId
    const videos = await Video.find({ user: userId }).sort({ createdAt: -1 });
    console.log('------<>',videos)
    const updatedVideos = videos.map(video => ({
      ...video._doc, // Spread existing video properties
      filePath: `http://localhost:5000/${video.filePath.replace(/\\/g, '/')}`, // Correct file path
    }));

    if (videos.length === 0) {
      // Handle case where user has no videos
      return res.status(200).json({ 
        message: 'No videos found. Start by uploading your first video!', 
        updatedVideos: [] 
      });
    }

    // Return the videos
    res.status(200).json({ message: 'Videos retrieved successfully.', updatedVideos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


module.exports = router;
