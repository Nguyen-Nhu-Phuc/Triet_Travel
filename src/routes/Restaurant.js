const express = require('express')
const router = express.Router()
const restaurantController = require('../app/controllers/Restaurant.controller')

router.post('/create', restaurantController.create)
router.get('/getAll', restaurantController.getAll)
router.get('/getById/:id', restaurantController.getById)
router.put('/update/:id', restaurantController.update)
router.delete('/delete/:id', restaurantController.deleteRestaurant)


module.exports = router