import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { REGISTER_USER } from '../graphql/Mutations'
import { Link } from 'react-router-dom'
export const Register = (props) => {
  const [variables, setVariables] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => {
      // localStorage.setItem('token', data.login.token)
      props.history.push('/login')
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors)
      setErrors(err.graphQLErrors[0].extensions.errors)
    }
  })

  // function registerUser(){
  //   addUser()
  // }
  const submitRegisterForm = e => {
    e.preventDefault()
    // console.log(variables)
    registerUser({ variables })
  }
  return (
    <Row className='bg-white p-5 justify-content-center'>
      <Col sm={8} md={6} lg={4}>
        <h1 className='text-center'>Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label className={errors.email && 'text-danger'}>{errors.email ?? 'Email address'}</Form.Label>
            <Form.Control
              type='email' value={variables.email}
              className={errors.email && 'is-invalid'}
              onChange={(e) => setVariables({ ...variables, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.username && 'text-danger'}>{errors.username ?? 'Username'}</Form.Label>
            <Form.Control
              type='text'
              value={variables.username}
              className={errors.usename && 'is-invalid'}
              onChange={(e) => setVariables({ ...variables, username: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Password'}</Form.Label>
            <Form.Control
              type='password' value={variables.password}
              className={errors.password && 'is-invalid'}
              onChange={(e) => setVariables({ ...variables, password: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={errors.confirmPassword && 'text-danger'}>{errors.confirmPassword ?? 'Confirm Password'}</Form.Label>
            <Form.Control
              type='password' value={variables.confirmPassword}
              className={errors.confirmPassword && 'is-invalid'}
              onChange={(e) => setVariables({ ...variables, confirmPassword: e.target.value })}
            />
          </Form.Group>
          <div className='text-center'>
            <Button variant='primary' type='submit' disabled={loading}>
              {loading ? 'Loading...' : 'Register'}
            </Button>
            <br />
            <small>Already have an account? <Link to='/login'>Login</Link></small>
          </div>
        </Form>
      </Col>
    </Row>
  )
}
