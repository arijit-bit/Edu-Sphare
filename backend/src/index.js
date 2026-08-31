require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.WEB_ORIGIN ? process.env.WEB_ORIGIN.split(',') : '*',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express server is running' });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('error', (e) => {
  console.error('Server error:', e);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
