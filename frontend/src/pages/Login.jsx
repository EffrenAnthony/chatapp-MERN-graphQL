import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { LOGIN_USER } from '../graphql/Mutations'
import { Link } from 'react-router-dom'

export const Login = (props) => {
  const [variables, setVariables] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update: (_, { data: { login: { token } } }) => {
      window.sessionStorage.setItem('token', token)
      props.history.push('/')
    },
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors)
      setErrors(err.graphQLErrors[0].extensions.errors)
    }
  })

  const submitLoginForm = e => {
    e.preventDefault()
    // console.log(variables)
    loginUser({ variables })
  }
  return (
    <Row className='bg-white p-5 justify-content-center'>
      <Col sm={8} md={6} lg={4}>
        <h1 className='text-center'>Login</h1>
        <Form onSubmit={submitLoginForm}>
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
          <div className='text-center'>
            <Button variant='primary' type='submit' disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </Button>
            <br />
            <small>Don't have an account? <Link to='/register'>Register</Link></small>
          </div>
          {
            Object.keys(errors).length > 0 &&
              <Alert variant='danger'>
                <ul className='list'>
                  {
                    Object.values(errors).map(value => (
                      <li key={value}>{value}</li>
                    ))
                  }
                </ul>
              </Alert>
        }
        </Form>
      </Col>
    </Row>
  )
}
