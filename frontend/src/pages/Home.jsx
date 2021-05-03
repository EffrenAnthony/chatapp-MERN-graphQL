import React, { useEffect } from 'react'
import { Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Messages } from '../components/Messages'
import { Users } from '../components/Users'
import { useAuthDispatch, useAuthState } from '../context/auth'
import { useMessageDispatch } from '../context/message'
import { useSubscription } from '@apollo/client'
import { NEW_MESSAGE, NEW_REACTION } from '../graphql/Subscriptions'

export const Home = ({ history }) => {
  const authDispatch = useAuthDispatch()
  const messageDispatch = useMessageDispatch()
  const { user } = useAuthState()

  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  )
  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  )
  useEffect(() => {
    if (messageError) console.log(messageError)

    if (messageData) {
      const message = messageData.newMessage
      const otherUser = user.username === message.to ? message.from : message.to

      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          username: otherUser,
          message
        }
      })
    }
  }, [messageError, messageData])

  useEffect(() => {
    if (reactionError) console.log(reactionError)

    if (reactionData) {
      const reaction = reactionData.newReaction
      const otherUser = user.username === reaction.message.to ? reaction.message.from : reaction.message.to

      messageDispatch({
        type: 'ADD_REACTION',
        payload: {
          username: otherUser,
          reaction
        }
      })
    }
  }, [reactionError, reactionData])
  const logout = () => {
    authDispatch({ type: 'LOGOUT' })
    // ? de esta manera evitamos que se queden guardados datos en cache y vuelva a hacer fetch de los datos del nuevo usuario
    window.location.href = '/login'
  }

  return (
    <>
      <Row className='bg-white justify-content-around mb-1'>
        <Link to='/login'>
          <Button variant='link'>Login</Button>
        </Link>
        <Link to='/register'>
          <Button variant='link'>Register</Button>
        </Link>
        <Button variant='link' onClick={logout}>Logout</Button>
      </Row>
      <Row className='bg-white'>
        <Users />
        <Messages />
      </Row>
    </>
  )
}
