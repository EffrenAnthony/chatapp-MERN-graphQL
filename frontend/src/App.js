import React from 'react'
import './App.scss'
import ApolloProvider from './ApolloProvider'
import { Container } from 'react-bootstrap'
import { Register } from './pages/Register'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
export const App = () => {
  return (
    <ApolloProvider>
      <Router>
        <Container className='pt-5'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
          </Switch>
        </Container>
      </Router>
    </ApolloProvider>
  )
}
