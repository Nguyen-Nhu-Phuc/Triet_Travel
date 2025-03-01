const express = require('express')
const router = express.Router()
const destinationController = require('../app/controllers/Destination.controller')

router.post('/', destinationController.create)
router.get('/', destinationController.getAll)
router.get('/:id', destinationController.getById)
router.put('/:id', destinationController.update)
router.delete('/:id', destinationController.softDelete) // Đảm bảo tên hàm chính xác
router.patch('/:id/restore', destinationController.restore)

module.exports = router
