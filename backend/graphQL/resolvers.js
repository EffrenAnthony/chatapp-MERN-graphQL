const userResolvers = require('./users/index')
const resolvers = {
  Query: {
    ...userResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation
  }
}

module.exports = { resolvers }
