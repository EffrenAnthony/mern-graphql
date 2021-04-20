import { useMutation } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Label } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import { LIKE_POST } from '../graphQL/Mutations'
import { MyPopup } from '../util/MyPopUp'

export const LikeButton = ({post: {id, likes, likeCount}}) => {
  const { user } = useContext(AuthContext)
  const [liked, setLiked] = useState(false)
  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)){
      setLiked(true)
    }else {
      setLiked(false)
    }
  }, [user, likes])

  // en este caso no necesitamos hacer update al query ya que estamos devolviendo un mismo objeto post, con su id, y Apollo se da cuenta de ello y actualizar elc omponente donde corresponde
  const [likePost] = useMutation(LIKE_POST,{
    variables: { postId: id}
  })

  const likeButton = user ? 
    liked ? 
      <Button color='teal'>
          <Icon name='heart' />
        </Button>
    :
      <Button color='teal' basic>
        <Icon name='heart' />
      </Button>
  :
    <Button as={Link} to='/login' color='teal' basic>
      <Icon name='heart' />
    </Button>
  return(
    <>
      <Button as='div' labelPosition='right' onClick={likePost}>
        <MyPopup content={liked ? "Unlike" : 'Like'}>
          {likeButton}
        </MyPopup>
        <Label basic color='teal' pointing='left'>
          {likeCount}
        </Label>
      </Button>
    </>
  )
}