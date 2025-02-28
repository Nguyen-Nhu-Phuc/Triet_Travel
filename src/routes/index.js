const authRouter = require('./Auth')
function route(app) {
  app.use('/v1/shop', authRouter)
}
module.exports = route
