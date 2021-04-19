import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import { DELETE_POST } from '../graphQL/Mutations'

export const DeleteButton = ({postId}) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletePost] = useMutation(DELETE_POST, {
    update(){
      setConfirmOpen(false)
      // TODO remove post from cache
    },
    variables: { postId }
  })
  return(
    <>
    <Button as='div' color='red' onClick={()=> setConfirmOpen(true)} floated='right'>
      <Icon name='trash' style={{margin: 0}}/>
    </Button>
    <Confirm 
      open={confirmOpen} 
      onCancel={()=> setConfirmOpen(false)}
      onConfirm={deletePost}
    />
    </>
  )
}