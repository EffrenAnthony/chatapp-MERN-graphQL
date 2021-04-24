import React from 'react'
import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink, from } from '@apollo/client'
import { ApolloProvider as Provider } from '@apollo/client/react'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = window.sessionStorage.getItem('token')
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    })
  }
  return forward(operation)
})

const errorMiddleware = onError(({ networkError }) => {
  if (networkError && networkError.result.code === 'invalid_token') {
    window.sessionStorage.removeItem('token')
    window.location.href = '/login'
  }
})
const client = new ApolloClient({
  link: from([
    errorMiddleware,
    authMiddleware,
    httpLink
    // authLink.concat(httpLink),
  ]),
  cache: new InMemoryCache()
})

export default function ApolloProvider (props) {
  return <Provider client={client} {...props} />
}
