import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ){
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ){
      id
      email
      token
      username
      createdAt
    }
  }
`
export const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ){
    login(
      username: $username
      password: $password
    ){
      id
      email
      token
      username
      createdAt
    }
  }
`