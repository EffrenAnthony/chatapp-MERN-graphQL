const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')
const { config } = require('../config')

module.exports = (context) => {
  // constext = { ... headers }
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    // bearer ...
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, config.SECRET_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    }
    throw new Error('Authentication token must be \' Bearer [token] ')
  }
  throw new Error('Authorization header must be provided')
}