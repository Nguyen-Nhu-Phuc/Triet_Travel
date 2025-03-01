const express = require('express')
const router = express.Router()
const destinationController = require('../app/controllers/Destination.controller')

router.post('/createdestination', destinationController.create)
router.get('/getAlldestination', destinationController.getAll)
router.get('/getBy/:id', destinationController.getById)
router.put('/update/:id', destinationController.update)
router.delete('/softdelete/:id', destinationController.softDelete)
router.patch('/:id/restore', destinationController.restore)

module.exports = router
