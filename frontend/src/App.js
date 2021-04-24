import React from 'react'
import './App.scss'
import ApolloProvider from './ApolloProvider'
import { Container } from 'react-bootstrap'
import { Register } from './pages/Register'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { AuthProvider } from './context/auth'
import DynamicRoute from './util/DynamicRoute'
import { MessageProvider } from './context/message'

export const App = () => {
  return (
    <ApolloProvider>
      <MessageProvider>
        <AuthProvider>
          <Router>
            <Container className='pt-5'>
              <Switch>
                <DynamicRoute exact path='/' component={Home} authenticated />
                <DynamicRoute path='/register' component={Register} guest />
                <DynamicRoute path='/login' component={Login} guest />
              </Switch>
            </Container>
          </Router>
        </AuthProvider>
      </MessageProvider>
    </ApolloProvider>
  )
}
