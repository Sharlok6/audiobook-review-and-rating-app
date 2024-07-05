const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// Route to fetch current user details
router.get('/me', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      //console.log("Data fetched: ", user);
      res.json({ id: user._id, name: user.name, email: user.email });
      
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    //console.log('Signup request body:', { name, email, password });
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error('Invalid JSON data');
    }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.log('Error is : ', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    //console.log('Login request received:', req.body);
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            alert("User not found");
            return res.status(400).json({ message: 'User not found' });
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error('Invalid JSON data');
        }
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                console.log('Password is incorrect');
                console.log('Invalid credentials',password," and ", user.password);
            } else {
                console.log('Password is correct');
            }
        });
        //console.log("User details ", user);

        // Password is correct, generate JWT token
        const tokenPayload = {
          id: user._id,
          name: user.name, // Add name to the token payload
          email: user.email
        };
        //console.log("Token: ",tokenPayload);
      const token = jwt.sign(tokenPayload, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, user: tokenPayload });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
// New route to fetch and log all users
router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find();
        //console.log('All users:', users);
        res.json(users); // Send users as JSON response if needed
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
