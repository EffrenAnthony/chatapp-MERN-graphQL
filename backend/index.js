const { ApolloServer, PubSub } = require('apollo-server')
const { resolvers } = require('./graphQL/resolvers')
const { typeDefs } = require('./graphQL/typeDefs')
const mongoose = require('mongoose')
const { config } = require('./config/index')

const pubsub = new PubSub()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => ({ req, pubsub, connection }),
  subscriptions: { path: '/' }
})

mongoose.connect(config.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('Mongo DB Connected')
  return server.listen({ port: config.port }).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`)
    console.log(`🚀  WebSocket at ${subscriptionsUrl}`)
  })
}).catch(err => { console.log(err) })
