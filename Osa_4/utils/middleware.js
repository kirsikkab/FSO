const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info(req.method, req.path)
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })

  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({
      error: 'expected `username` to be unique'
    })

  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}