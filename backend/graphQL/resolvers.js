const userResolvers = require('./users/index')
const messageResolvers = require('./message/index')
const resolvers = {
  // Message: {
  //   createdAt: (parent) => parent.createdAt.toISOString()
  // },
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
