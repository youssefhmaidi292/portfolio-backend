require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contact = require('./routes/contact');
const testimonials = require('./routes/testimonials');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contact);
app.use('/api/testimonials', testimonials);


// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
