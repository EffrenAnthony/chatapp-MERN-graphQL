import React from 'react'
import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink, from, split } from '@apollo/client'
import { ApolloProvider as Provider } from '@apollo/client/react'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

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

// httpLink = authMiddleware.concat(httpLink)
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${window.sessionStorage.getItem('token')}`
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

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
    splitLink
    // authLink.concat(httpLink),
  ]),
  cache: new InMemoryCache()
})

export default function ApolloProvider (props) {
  return <Provider client={client} {...props} />
}
