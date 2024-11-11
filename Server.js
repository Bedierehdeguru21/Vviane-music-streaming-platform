// server.js
const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Cloudinary configuration (for storing audio and images)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Example API endpoints

// Upload song
app.post('/api/songs', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artistId, albumId, genre, releaseDate } = req.body;
    
    // Upload audio to Cloudinary
    const audioResult = await cloudinary.uploader.upload(req.files.audio[0].path, {
      resource_type: 'auto',
      folder: 'songs'
    });

    // Upload cover image to Cloudinary
    const imageResult = await cloudinary.uploader.upload(req.files.cover[0].path, {
      folder: 'covers'
    });

    // Calculate duration (you'll need to implement this based on your needs)
    const duration = '00:03:30'; // Example duration

    // Insert into database
    const query = `
      INSERT INTO songs (song_title, song_duration, album_id, artist_id, cover_image_url, audio_url, genre, release_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      title,
      duration,
      albumId,
      artistId,
      imageResult.secure_url,
      audioResult.secure_url,
      genre,
      releaseDate
    ];

    const result = await pool.query(query, values);

    // Clean up uploaded files
    fs.unlinkSync(req.files.audio[0].path);
    fs.unlinkSync(req.files.cover[0].path);

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get song details
app.get('/api/songs/:id', async (req, res) => {
  try {
    const query = `
      SELECT s.*, a.name as artist_name, al.album_name
      FROM songs s
      JOIN artists a ON s.artist_id = a.artist_id
      LEFT JOIN album al ON s.album_id = al.album_id
      WHERE s.song_id = $1
    `;
    
    const result = await pool.query(query, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add song to playlist
app.post('/api/playlists/:playlistId/songs', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;

    const query = `
      INSERT INTO playlist_songs (playlist_id, song_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await pool.query(query, [playlistId, songId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
