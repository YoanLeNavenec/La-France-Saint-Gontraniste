require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Admin = require('./models/Admin')

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI)

  const passwordHash = await bcrypt.hash('Mrouw0340', 10)

  await Admin.create({
    username: 'SashaAdmin',
    passwordHash,
  })

  console.log('Admin created')
  mongoose.disconnect()
}

createAdmin()