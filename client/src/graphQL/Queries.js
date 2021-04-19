import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
  query{
  getPosts{
    id
    body
    createdAt
    username
    likeCount
    commentCount
    comments{
      id
      username
      createdAt
      body
    }
    likes{
      id
      createdAt
      username
    }
  }
}
`