import React from 'react'
import { Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Messages } from '../components/Messages'
import { Users } from '../components/Users'
import { useAuthDispatch } from '../context/auth'

export const Home = ({ history }) => {
  const dispatch = useAuthDispatch()
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
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
