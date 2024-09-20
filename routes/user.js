const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { name, password, email, phone, profession } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashedPassword, email, phone, profession });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// Get All Users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Update User
router.put('/:id', async (req, res) => {
  const { name, phone } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { name, phone });
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Delete failed' });
  }
});

module.exports = router;
