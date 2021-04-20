import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Confirm, Icon } from 'semantic-ui-react'
import { DELETE_COMMENT, DELETE_POST } from '../graphQL/Mutations'
import { FETCH_POSTS_QUERY } from '../graphQL/Queries'
import { MyPopup } from '../util/MyPopUp'


export const DeleteButton = ({postId, commentId, callback}) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST
  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy){
      setConfirmOpen(false)
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        // necesitamos ahcer una copia mutable de getpOST ANTES DE PASARLO
        let newData = [...data.getPosts];
        newData = newData.filter(p => p.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            ...data,
            getPosts: {
              newData,
            },
          },
        })
      }
      if (callback) {
        callback()
      }
    },
    variables: { postId, commentId }
  })
  return(
    <>
    
    <MyPopup
      content={commentId ? 'Delete Comment' : 'Delete Post'}>
      <Button as='div' color='red' onClick={()=> setConfirmOpen(true)} floated='right'>
        <Icon name='trash' style={{margin: 0}}/>
      </Button> 
    </MyPopup>
    
      <Confirm 
        open={confirmOpen} 
        onCancel={()=> setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
      </>
  )
}