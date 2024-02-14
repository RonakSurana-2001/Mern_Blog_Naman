require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Constants for Endpoints
const REGISTER_ENDPOINT = '/register';
const LOGIN_ENDPOINT = '/login';
const LOGOUT_ENDPOINT = '/logout';
const PROFILE_ENDPOINT = '/profile';

// Registration Endpoint
app.post(REGISTER_ENDPOINT, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    res.json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// Login Endpoint
app.post(LOGIN_ENDPOINT, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username, userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }).json({ id: user._id, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// Logout Endpoint
app.post(LOGOUT_ENDPOINT, (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Profile Endpoint
app.get(PROFILE_ENDPOINT, (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;

    // Log the decoded information for debugging
    console.log('Decoded Token:', decoded);

    // In a real-world scenario, you'd fetch user information from the database based on userId
    const user = { username: 'demo_user' }; // Replace with actual user data
    res.json({ user });
  } catch (error) {
    console.error('Error during profile retrieval:', error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
