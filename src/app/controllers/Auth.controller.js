const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const User = require('../models/User.model')

dotenv.config()

const authController = {
  async signUp(req, res) {
    const { fullName, username, email, password } = req.body
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = new User({ fullName, username, email, password: hashedPassword })
      const user = await newUser.save()
      return res.status(200).json(user)
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong!' })
    }
  },

  async signIn(req, res) {
    const { username, password } = req.body
    try {
      const user = await User.findOne({ username })
      if (!user) return res.status(400).json({ message: 'Invalid username!' })

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) return res.status(400).json({ message: 'Invalid password!' })

      const { password: _, ...userData } = user._doc
      return res.status(200).json(userData)
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async signOut(req, res) {
    const { username } = req.body
    try {
      const user = await User.findOne({ username })
      if (!user) return res.status(400).json({ message: 'Invalid username!' })

      return res.status(200).json({ message: 'Logged out successfully!' })
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password').lean()
      return res.status(200).json(users)
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

module.exports = authController
