require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRouter = require('./routes/contact'); 

const app = express();

app.use(cors());
app.use(express.json());


app.use('/contact', contactRouter); 

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
