const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server')
const User = require('../../models/user')
const Message = require('../../models/message')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { config } = require('../../config')

function generateToken (user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, config.SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        let user
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split('Bearer ')[1]
          jwt.verify(token, config.SECRET_KEY, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError('Unauthenticated')
            }
            user = decodedToken
          })
        }
        let users = await User.find({ username: { $ne: user.username } })
        // get the latestMessage
        const allUsersMessages = await Message.find({ $or: [{ from: user.username }, { to: user.username }] }).sort({ createdAt: -1 })

        users = users.map(otherUser => {
          const latestMessage = allUsersMessages.find(
            m => m.from === otherUser.username || m.to === otherUser.username
          )
          otherUser.latestMessage = latestMessage
          return otherUser
        })
        return users
      } catch (e) {
        console.log(e)
        throw e
      }
    }
  },
  Mutation: {
    async login (_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('Wrong credentials', { errors })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = generateToken(user)
      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    async register (_, { registerInput: { username, email, password, confirmPassword } }
      // context,
      // info
    ) {
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // TODO Make sure user doesn't already exist
      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }
      // TODO hash password and create an auth token
      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      })
      const res = await newUser.save()
      const token = generateToken(res)
      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}
