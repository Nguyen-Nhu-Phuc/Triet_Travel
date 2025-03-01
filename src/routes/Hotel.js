const express = require('express')
const router = express.Router()
const hotelController = require('../app/controllers/Hotel.controller')

router.post('/', hotelController.create)

module.exports = router