const Message = require('../../models/message')
const checkAuth = require('../../util/check-auth')
const User = require('../../models/User')
const { UserInputError } = require('apollo-server')

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
      return message
    }
  }
}
