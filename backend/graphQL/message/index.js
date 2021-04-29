const Message = require('../../models/message')
const checkAuth = require('../../util/check-auth')
const User = require('../../models/User')
const { UserInputError, AuthenticationError, withFilter } = require('apollo-server')

module.exports = {
  Query: {
    getMessages: async (parent, { from }, context) => {
      try {
        const user = checkAuth(context)
        const otherUser = await User.findOne({ username: from })
        console.log(otherUser)
        if (!otherUser) throw new UserInputError('User not found')
        const usernames = [user.username, otherUser.username]
        const messages = await Message.find({
          from: usernames,
          to: usernames
        }).sort({ createdAt: -1 })
        return messages
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  },
  Mutation: {
    sendMessage: async (_, { to, content }, context) => {
      try {
        const user = checkAuth(context)
        const recipient = await User.findOne({ username: to })
        console.log(recipient)
        if (!recipient) {
          throw new UserInputError('User not found')
        } else if (recipient.username === user.username) {
          throw new UserInputError('You cant message yourself')
        }
        if (content.trim() === '') {
          throw new Error('post body must not be empty')
        }
        const newMessage = new Message({
          content,
          to,
          user: user.id,
          from: user.username,
          createdAt: new Date().toISOString()
        })
        const message = await newMessage.save()

        context.pubsub.publish('NEW_MESSAGE', { newMessage: message })
        return message
      } catch (err) {
        console.log(err)
        throw err
      }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter((_, __, context) => {
        const user = checkAuth(context)
        if (!user) throw new AuthenticationError('Unauthenticated')
        return context.pubsub.asyncIterator(['NEW_MESSAGE'])
      }, ({ newMessage }, _, context) => {
        const user = checkAuth(context)
        if (newMessage.from === user.username || newMessage.to === user.username) {
          return true
        } else {
          return false
        }
      })
    }
  }
}
