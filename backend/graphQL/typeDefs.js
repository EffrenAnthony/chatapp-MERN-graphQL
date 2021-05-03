const { gql } = require('apollo-server')

const typeDefs = gql`
  type User{
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
    latestMessage: Message
  }
  type Message {
    id: ID!
    content: String!
    from: String!
    to: String!
    createdAt: String!
    reactions: [Reaction]
  }
  type Reaction {
    id: ID!
    content: String!
    createdAt: String!
    message: Message!
    user: User!
  }
  type Query {
    getUsers: [User]!
    getMessages(from: String!): [Message]!
  }
  input RegisterInput{
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Mutation{
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(id: String! content: String!): Reaction!
  }
  type Subscription{
    newMessage: Message!
    newReaction: Reaction!
  }
`
module.exports = { typeDefs }
