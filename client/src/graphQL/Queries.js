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

export const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }

`