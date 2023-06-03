const mongoose = require('mongoose');

// Define the Track schema
const trackSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  length: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  md5: { type: String, required: true },
  metadata: {
    trackName: { type: String, required: true },
    artist: { type: String }
  }
});

// Create the Track model
const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
