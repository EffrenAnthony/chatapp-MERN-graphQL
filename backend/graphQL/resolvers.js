const userResolvers = require('./users/index')
const messageResolvers = require('./message/index')
const User = require('../models/user')
const Message = require('../models/message')
const resolvers = {
  // Message: {
  //   createdAt: (parent) => parent.createdAt.toISOString()
  // },
  Reaction: {
    message: async (parent) => await Message.findById(parent.message._id),
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
