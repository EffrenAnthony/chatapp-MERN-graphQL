/* eslint-disable no-useless-catch */
const Message = require('../../models/message')
const checkAuth = require('../../util/check-auth')
const User = require('../../models/user')
const { UserInputError, AuthenticationError, withFilter, ForbiddenError } = require('apollo-server')
const Reaction = require('../../models/reaction')

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
          // reactions: { $exists: Reaction }
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
    },
    reactToMessage: async (_, { id, content }, context) => {
      const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
      try {
        if (!reactions.includes(content)) {
          throw new UserInputError('Invalid reaction')
        }
        let user = checkAuth(context)
        const username = user ? user.username : ''
        user = await User.findOne({ username: username })
        if (!user) throw new AuthenticationError('Unauthenticated user')

        const message = await Message.findOne({ _id: id })
        if (!message) throw new UserInputError('message not found')

        if (message.from !== user.username && message.to !== user.username) {
          throw new ForbiddenError('Unauthorized')
        }

        let reaction = await Reaction.findOne({ message: message._id, user: user._id })
        if (reaction) {
          reaction.content = content
          await reaction.save()
        } else {
          reaction = await new Reaction({
            message: message.id,
            user: user.id,
            content,
            createdAt: new Date().toISOString()
          }).save()
        }

        context.pubsub.publish('NEW_REACTION', { newReaction: reaction })
        return reaction
      } catch (err) {
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
    },
    newReaction: {
      subscribe: withFilter((_, __, context) => {
        const user = checkAuth(context)
        if (!user) throw new AuthenticationError('Unauthenticated')
        return context.pubsub.asyncIterator(['NEW_REACTION'])
      }, async ({ newReaction }, _, context) => {
        const user = checkAuth(context)
        const message = await Message.findOne({ _id: newReaction.message })
        if (message.from === user.username || message.to === user.username) {
          return true
        } else {
          return false
        }
      })
    }
  }
}
