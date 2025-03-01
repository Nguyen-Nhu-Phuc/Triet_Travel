const express = require('express')
const router = express.Router()
const placeController = require('../app/controllers/Place.controller')

router.post('/create', placeController.create)
router.get('/getAll', placeController.getAll)
router.get('/getById/:id', placeController.getById)
router.put('/update/:id', placeController.update)
router.delete('/delete/:id', placeController.deletePlace)

module.exports = router