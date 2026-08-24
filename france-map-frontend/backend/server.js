require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const City = require('./models/City')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.find()
    res.json(cities)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities'})
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))