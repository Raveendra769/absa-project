// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('ABSA backend running!');
});

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/absa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
