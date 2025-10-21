require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const contact = require('./routes/contact');

const app = express();

app.use(cors());
app.use(express.json());      
app.use('/api/contact', contact);

app.listen(process.env.PORT, () => console.log(`Server is running `));