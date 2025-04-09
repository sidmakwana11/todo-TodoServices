require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.use('/', todoRoutes);

const port = 5002;
app.listen(port, () => console.log(`🚀 Todo Service running on port ${port}`));
