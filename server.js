// server.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/webhook', webhookRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('GPT Messenger Chatbot Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});