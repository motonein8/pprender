// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/ppics', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.set('Content-Type', contentType);
    res.status(response.status);
    response.body.pipe(res);
  } catch (e) {
    console.error('P error:', e);
    res.status(500).send('P failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`P running on port ${PORT}`));
