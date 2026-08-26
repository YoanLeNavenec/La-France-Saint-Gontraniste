const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
  position: {
    type: [Number], // [lat, lng]
    required: true,
  },
  oldName: { type: String, required: true },
  newName: { type: String, required: true },
  lore: { type: String, default: '' },
  image: { type: String, default: '' },
  departement: { type: String, required: true },
  tier: {
    type: String,
    enum: ['region', 'small'],
    required: true,
  },
})

module.exports = mongoose.model('City', citySchema)