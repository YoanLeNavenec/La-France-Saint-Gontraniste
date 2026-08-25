require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const City = require('./models/City')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('./models/Admin')
const requireAuth = require('./middleware/auth')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

//admin login and error handling
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  const admin = await Admin.findOne({ username })
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash)
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

  res.json({ accessToken, refreshToken })
})

//using the refresh token to give a new auth token
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' })
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' })
    res.json({ accessToken })
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired refresh token' })
  }
})

//fetching cities
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.find()
    res.json(cities)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities'})
  }
})

//CRUD for cities
app.post('/api/cities', requireAuth, async (req, res) => {
  try {
    const newCity = await City.create(req.body)
    res.status(201).json(newCity)
  } catch (err) {
    res.status(400).json({ error: 'Failed to create city', details: err.message })
  }
})

app.put('/api/cities/:id', requireAuth, async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updatedCity) {
      return res.status(404).json({ error: 'City not found' })
    }
    res.json(updatedCity)
  } catch (err) {
    res.status(400).json({ error: 'Failed to update city', details: err.message })
  }
})

app.delete('/api/cities/:id', requireAuth, async (req, res) => {
  const deletedCity = await City.findByIdAndDelete(req.params.id)
  if (!deletedCity) {
    return res.status(404).json({ error: 'City not found' })
  }
  res.json({ message: 'City deleted' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))