import React from 'react'
import App from './App'
import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react';
import { onError } from '@apollo/client/link/error'


const httpLink = createHttpLink({
  uri: 'https://social-graphql-effrenanthony.vercel.app/'
})
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('jwtToken')
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
    localStorage.removeItem('jwtToken')
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

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

