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
  }
`
module.exports = { typeDefs }
