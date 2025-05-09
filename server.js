require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path, stat) => {
      res.setHeader('Access-Control-Allow-Origin', '*'); // or restrict to your frontend origin
    }
  }));
  

// ✅ DB + Routes
connectDB();
app.use('/', todoRoutes);

// ✅ Start server
const port = 5004;
app.listen(port, () => console.log(`🚀 Todo Service running on port ${port}`));
