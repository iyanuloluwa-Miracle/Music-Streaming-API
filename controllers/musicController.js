const { Readable } = require('stream');
const mongodb = require('mongodb');
const { db } = require('../models/database');
const Track = require('../models/track');
const multer = require('multer')

exports.uploadTrack = (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: "Upload Request Validation Failed" });
  } else if (!req.body.name) {
    return res.status(400).json({ message: "No track name in request body" });
  }

  let trackName = req.body.name;

  // Covert buffer to Readable Stream
  const readableTrackStream = new Readable();
  readableTrackStream.push(req.file.buffer);
  readableTrackStream.push(null);

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'tracks'
  });

  let uploadStream = bucket.openUploadStream(trackName);
  let id = uploadStream.id;
  readableTrackStream.pipe(uploadStream);

  uploadStream.on('error', () => {
    return res.status(500).json({ message: "Error uploading file" });
  });

  uploadStream.on('finish', () => {
    // Get the download URL for the uploaded track
    const downloadUrl = `/tracks/${id}`;

    const track = new Track({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      length: req.file.size,
      uploadDate: new Date(),
      md5: req.file.md5,
      metadata: {
        trackName: trackName
      }
    });

    track.save()
      .then(() => {
        return res.status(201).json({ 
          message: "File uploaded successfully, stored under Mongo ObjectID: " + id,
          downloadUrl: downloadUrl
        });
      })
      .catch(() => {
        return res.status(500).json({ message: "Error saving track information" });
      });
  });
};

exports.playTrack = (req, res) => {
  const trackId = new mongodb.ObjectID(req.params.trackId);

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'tracks'
  });

  // Open download stream for the track
  let downloadStream = bucket.openDownloadStream(trackId);

  // Set the response headers for audio playback
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');

  // Pipe the download stream to the response
  downloadStream.pipe(res);

  downloadStream.on('error', () => {
    return res.status(500).json({ message: "Error streaming the track" });
  });
};
