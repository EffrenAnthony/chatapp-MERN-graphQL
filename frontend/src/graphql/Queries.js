import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query {
  getUsers{
    username
    email
    createdAt
    latestMessage{
      id
      content
      from
      to
    }
  }
}
`
export const GET_MESSAGES = gql`
  query getMessages($from: String!){
    getMessages(from: $from){
      id
      content
      from
      to
      createdAt
      reactions{
      id
      content
    }
    }
  }
`
