// models/Video.js
const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String, required: true },
//   thumbnail: { type: String, required: true }, // Add thumbnail field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Video', VideoSchema);
