require('dotenv').config()

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 4000,
  cors: process.env.CORS,
  mongodb: process.env.MONGODB,
  SECRET_KEY: 'some very secret key'
}

module.exports = { config }
