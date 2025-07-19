const express = require('express');
const axios = require('axios');
const app = express();

app.get('/ppics', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  try {
    console.log('url', url);
    const response = await axios.get(url, {
      responseType: 'stream',
    });

    res.set('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.status(response.status);
    response.data.pipe(res); // stream the image
  } catch (e) {
    console.error('P error:', e.message);
    res.status(500).send('P failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`P running on port ${PORT}`));