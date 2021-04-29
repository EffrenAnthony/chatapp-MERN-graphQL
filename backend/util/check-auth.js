const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')
const { config } = require('../config')

// const { PubSub } = require('apollo-server')

// const pubsub = new PubSub()

module.exports = (context) => {
  // constext = { ... headers }
  // constext = { ... headers }
  let token
  if (context.req && context.req.headers.authorization) {
    // bearer ...
    token = context.req.headers.authorization.split('Bearer ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, config.SECRET_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    }
    throw new Error('Authentication token must be \' Bearer [token] ')
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split('Bearer ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, config.SECRET_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    }
  }
  throw new Error('Authorization header must be provided')
}
