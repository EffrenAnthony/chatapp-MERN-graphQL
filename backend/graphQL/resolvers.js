const userResolvers = require('./users/index')
const messageResolvers = require('./message/index')
const User = require('../models/user')
const Message = require('../models/message')
const Reaction = require('../models/reaction')

const resolvers = {
  Message: {
    reactions: async (parent) => {
      if (parent.reactions.length > 0) {
        let reactions = []
        for (let i = 0; i < parent.reactions.length; i++) {
          const findedReaction = await Reaction.findById(parent.reactions[i])
          // console.log(findedReaction)
          reactions = [...reactions, findedReaction]
        }
        return reactions
      } else {
        return []
      }
      // console.log(reactions)
    }
  },
  Reaction: {
    message: async (parent) => {
      console.log(parent.message._id)
      return await Message.findById(parent.message._id)
    },
    user: async (parent) => await User.findById(parent.user._id)
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation
  },
  Subscription: {
    ...messageResolvers.Subscription
  }
}

module.exports = { resolvers }
