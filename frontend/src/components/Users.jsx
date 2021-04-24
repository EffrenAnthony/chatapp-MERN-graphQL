import { useQuery } from '@apollo/client'
import React from 'react'
import { Col, Image } from 'react-bootstrap'
import { GET_USERS } from '../graphql/Queries'
import gravatar from '../util/Gravatar'
import classNames from 'classnames'
import { useMessageDispatch, useMessageState } from '../context/message'

export const Users = () => {
  const dispatch = useMessageDispatch()
  const { users } = useMessageState()
  const selectedUser = users?.find(u => u.selected === true)?.username
  const { loading } = useQuery(GET_USERS, {
    onCompleted: data => dispatch({ type: 'SET_USERS', payload: data.getUsers }),
    onError: err => console.log(err)
  })
  let usersMarkup
  if (!users || loading) {
    usersMarkup = <p>Loading...</p>
  } else if (users.length === 0) {
    usersMarkup = <p>No users have joined yet</p>
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const seleted = selectedUser === user.username
      return (
        <div
          role='button'
          className={classNames('d-flex p-3 user-div', { 'bg-white': seleted })}
          key={user.username}
          onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user.username })}
        >
          <Image
            src={gravatar(user.email)}
            roundedCircle className='mr-2'
            style={{ width: 50, height: 50, objectFit: 'cover' }}
          />
          <div>
            <p className='text-success'>{user.username}</p>
            <p className='font-weight-light'>{user.latestMessage ? user.latestMessage.content : 'You are not conected'}</p>
          </div>
        </div>
      )
    })
  }
  return (
    <Col xs={4} className='p-0 bg-secondary'>
      {usersMarkup}
    </Col>
  )
}
