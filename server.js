const express = require('express');
const axios = require('axios');
const cors = require('cors');
//require('dotenv').config(); // Load .env variables

const app = express();

const CDN_BASE = process.env.CDN_BASE;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  }
}));

app.get('/pp', async (req, res) => {
  const { u } = req.query;

  if (!u || !u.startsWith('/')) {
    return res.status(400).send('Invalid or missing relative URL');
  }

  const targetUrl = CDN_BASE.replace(/\/+$/, '') + u;

  try {
    const response = await axios.get(targetUrl, { responseType: 'stream' });
    res.set('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.status(response.status);
    response.data.pipe(res);
  } catch (e) {
    console.error('P error:', e.message);
    res.status(500).send('P failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`P running on port ${PORT}`));