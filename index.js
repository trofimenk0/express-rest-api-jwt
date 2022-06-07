const express = require('express');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

// Import routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

// Middlewares
app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);

// Database connection
mongoose.connect(
    process.env.DB_CONNECTION_URL,
    () => console.log('Connected to MongoDB!')
);

app.listen(3000, () => console.log('Server up and running'));