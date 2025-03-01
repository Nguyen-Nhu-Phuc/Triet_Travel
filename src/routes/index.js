const route = (app) => {
  app.use('/api/v1/auth', require('./Auth'))
  app.use('/api/v1/destination', require('./Destination'))
}

module.exports = route
