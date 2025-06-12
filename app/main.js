const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const bot = require('../bot/src/bot.js')

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())



// Route to serve the JSON file
app.get('/legacyMode.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'legacyMode.json'), (err) => {
    if (err) {
      res.status(500).send('Error sending JSON file');
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/templates', 'index.html'));
})

app.post('/', (req, res) => {
  const url = req.body.url
  bot.goto(url)
  res.redirect(302, '/?success=true')
})

app.get('/preview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/templates', 'preview.html'));
})

app.use((req, res, next) => {
  console.warn(`[404] Resource not found: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Not Found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});