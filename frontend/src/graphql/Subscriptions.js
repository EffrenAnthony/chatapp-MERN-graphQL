import { gql } from '@apollo/client'

export const NEW_MESSAGE = gql`
  subscription newMessage{
  newMessage{
    id
    from
    to
    createdAt
    content
  }
}
`

export const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      id
      content
      message{
        id
        from
        to  
      }
    }
  }
`
