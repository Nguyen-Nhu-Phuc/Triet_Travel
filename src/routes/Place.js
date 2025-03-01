const express = require('express')
const router = express.Router()
const placeController = require('../app/controllers/Place.controller')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', upload.array('image', 10), placeController.create)
router.get('/getAll', placeController.getAll)
router.get('/getById/:id', placeController.getById)
router.patch('/update/:id', placeController.update)
router.delete('/delete/:id', placeController.deletePlace)

module.exports = router