import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, Fragment, useState } from 'react'
import { Col, Form } from 'react-bootstrap'
import { useMessageDispatch, useMessageState } from '../context/message'
import { SEND_MESSAGE } from '../graphql/Mutations'
import { GET_MESSAGES } from '../graphql/Queries'
import { Message } from './Message'
import { MdSend } from 'react-icons/md'
export const Messages = () => {
  const { users } = useMessageState()
  const [content, setContent] = useState('')
  const dispatch = useMessageDispatch()

  const selectedUser = users?.find((u) => u.selected === true)
  const messages = selectedUser?.messages

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData }
  ] = useLazyQuery(GET_MESSAGES)

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    // onCompleted: data => dispatch({
    //   type: 'ADD_MESSAGE',
    //   payload: {
    //     username: selectedUser.username,
    //     message: data.sendMessage
    //   }
    // }),
    onError: err => console.log(err)
  })
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } })
    }
  }, [selectedUser])

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages
        }
      })
    }
  }, [messagesData])

  const submitMessage = e => {
    e.preventDefault()
    if (content.trim() === '' || !selectedUser) return
    setContent('')
    sendMessage({ variables: { to: selectedUser.username, content: content } })
  }
  let selectedChatMarkup

  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className='info-text'>Select a friend</p>
  } else if (messagesLoading) {
    selectedChatMarkup = <p className='info-text'>Loading..</p>
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.id}>
        <Message message={message} />
        {
          index === messages.length - 1 &&
            <div className='invisible'>
              <hr className='m-0' />
            </div>
        }
      </Fragment>
    ))
  } else if (messages.length === 0) {
    selectedChatMarkup = <p className='info-text'>You are now connected! send your first message!</p>
  }

  return (
    <Col xs={10} md={8}>
      <div className='messages-box d-flex flex-column-reverse'>
        {selectedChatMarkup}
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <Form.Group className='d-flex align-items-center'>
            <Form.Control
              type='text'
              className='message-input rounded-pill bg-secondary p-4 border-0'
              placeholder='Type a message...'
              value={content} onChange={e => setContent(e.target.value)}
            />
            <MdSend size='30' className='text-primary' onClick={submitMessage} role='button' />
          </Form.Group>
        </Form>
      </div>
    </Col>
  )
}
