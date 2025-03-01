const express = require('express')
const router = express.Router()
const hotelController = require('../app/controllers/Hotel.controller')

router.post('/create', hotelController.create)
router.get('/getAll', hotelController.getAll)
router.get('/getById/:id', hotelController.getById)
router.put('/update/:id', hotelController.update)
router.delete('/delete/:id', hotelController.deleteHotel)

module.exports = router