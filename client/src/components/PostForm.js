import React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../hooks/useForm'
import { useMutation } from '@apollo/client'
import { CREATE_POST } from '../graphQL/Mutations'
import { FETCH_POSTS_QUERY } from '../graphQL/Queries'

export function PostForm(){

  const {values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  })
  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy,result){
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })
      data.getPosts = [result.data.createPost, ...data.getPosts]
      proxy.writeQuery({query: FETCH_POSTS_QUERY, data})
      values.body = ''
    }
  })

  function createPostCallback(params) {
    createPost()
  }
  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post</h2>
      <Form.Field>
        <Form.Input 
          placeholder = 'Hi WORLD'
          name = 'body'
          onChange = {onChange}
          value = {values.body}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
  )
}