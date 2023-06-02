const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  originalname: String,
  mimetype: String,
  filename: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Add additional fields as needed for song metadata (e.g., artist, album, duration)
  artist: String,
  album: String,
  duration: Number,
  // ...
});

module.exports = mongoose.model('Song', songSchema);
