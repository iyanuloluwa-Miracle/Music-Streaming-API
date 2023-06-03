require('dotenv').config();
const Song = require('../models/Song');
const path = require('path');
const jwt = require('jsonwebtoken');


exports.upload = async (req, res) => {
  try {
    // Store the uploaded song details in the database
    const { originalname, mimetype, filename } = req.file;

    // Verify the token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      // Assuming you have stored the userId in the request object during authentication
      const userId = decodedToken.userId;
      // You can perform additional authorization checks here if needed

      // Create a new song record in the database
      const newSong = new Song({
        originalname,
        mimetype,
        filename,
        userId
      });

      await newSong.save();

      res.send('Song uploaded successfully');
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.getSong = async (req, res) => {
  try {
    const songId = req.params.id;

    // Retrieve the song from the database based on the songId
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).send('Song not found');
    }

    // Assuming you have stored the path where the songs are stored
    const filePath = path.join(__dirname, '..', 'path', 'to', 'songs', song.filename);

    // Verify the token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      // Assuming you have stored the userId in the request object during authentication
      const userId = decodedToken.userId;
      // You can perform additional authorization checks here if needed

      // Send the song file to the client
      res.sendFile(filePath, (err) => {
        if (err) {
          res.status(500).send('Internal Server Error');
        }
      });
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};