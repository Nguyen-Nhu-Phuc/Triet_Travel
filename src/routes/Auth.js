const AuthController = require('../app/controllers/Auth.controller')
// const middlewareController = require('../app/controllers/Middleware.controller')
const express = require('express')
const router = express.Router()

router.post('/SignUp', AuthController.signUp)
router.post('/SignIn', AuthController.signIn)
module.exports = router
