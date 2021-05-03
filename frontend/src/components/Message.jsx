import React, { useState } from 'react'
import classNames from 'classnames'
import { useAuthState } from '../context/auth'
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
import moment from 'moment'
import { MdTagFaces } from 'react-icons/md'
import { REACT_TO_MESSAGE } from '../graphql/Mutations'
import { useMutation } from '@apollo/client'

const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

export const Message = ({ message }) => {
  const { user } = useAuthState()
  const sent = message.from === user.username
  const received = !sent
  const [showPopover, setShowPopover] = useState(false)
  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: err => console.log(err),
    onCompleted: (data) => {
      setShowPopover(false)
    }
  })
  const react = (reaction) => {
    // console.log(`Reacting ${reaction} to message: ${message.id}`)
    reactToMessage({ variables: { id: message.id, content: reaction } })
  }
  const reactButton = (
    <OverlayTrigger
      trigger='click'
      placement='top'
      show={showPopover}
      onToggle={setShowPopover}
      transition={false}
      rootClose
      overlay={
        <Popover className='rounded-pill'>
          <Popover.Content className='d-flex px-0 py-1 align-items-center react-button-popover'>
            {reactions.map(reaction => (
              <Button variant='link' className='react-icon-button' key={reaction} onClick={() => react(reaction)}>
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant='link' className='px-2'>
        <MdTagFaces />
      </Button>
    </OverlayTrigger>
  )
  return (
    <div className={classNames('d-flex my-3', {
      'ml-auto': sent,
      'mr-auto': received
    })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement={sent ? 'right' : 'left'}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
          </Tooltip>
      }
        transition={false}
      >
        <div className={classNames('py-2 px-3 rounded-pill', {
          'bg-primary': sent,
          'bg-secondary': received
        })}
        >
          <p className={classNames({ 'text-white': sent })} key={message.id}>{message.content}</p>
        </div>
      </OverlayTrigger>
      {received && reactButton}
    </div>

  )
}
