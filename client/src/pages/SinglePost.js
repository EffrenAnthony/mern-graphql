import { useQuery } from '@apollo/client'
import moment from 'moment'
import React, { useContext } from 'react'
import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react'
import { DeleteButton } from '../components/DeleteButton'
import { LikeButton } from '../components/LikeButton'
import { AuthContext } from '../context/auth'
import { FETCH_POST_QUERY } from '../graphQL/Queries'

export const SinglePost = (props) => {
  const { user } = useContext(AuthContext)
  const postId = props.match.params.postId
  console.log(postId);
  const {data} = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    }
  })
  let postMarkup
  if (!data) {
    postMarkup = <p>Loading post...</p>
  } else {
    console.log(data.getPost);
    const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = data.getPost

    postMarkup = (
    <Grid>
      <Grid.Row>
        <Grid.Column with={2}>
          <Image
            floated='right'
            size='small'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
        </Grid.Column>
        <Grid.Column with={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt)}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr/>
            <Card.Content extra>
              <LikeButton user={user} post={{id, likeCount, likes}}/>
              <Button as='div' labelPosition='right' onClick={()=>console.log('COmment post')}> 
                <Button basic color='blue'>
                  <Icon name='comments'/>
                </Button>
                <Label basic color='blue' pointing='left'>
                  {commentCount}
                </Label>
              </Button>
              {user && user.username === username &&
                <DeleteButton postId={id} />
              }
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>)
  }
  return postMarkup
  
}
