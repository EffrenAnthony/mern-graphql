import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, GridColumn } from 'semantic-ui-react'
import { PostCard }from '../components/PostCard'
import { FETCH_POSTS_QUERY } from '../graphQL/Queries';
import { AuthContext } from '../context/auth';
import { PostForm } from '../components/PostForm';
const Home = () => {
  const { user } = useContext(AuthContext)
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  if (loading) {
    return <h1>Loading..</h1>
  }
    
  return (
    <Grid columns={3}>
    <Grid.Row className='page-title'>
      <h1>Recent Posts</h1>
    </Grid.Row>
    <Grid.Row>
      {
        user && (
          <GridColumn>
            <PostForm/>
          </GridColumn>
        )
      }
        {
          data.getPosts && data.getPosts.map(post => (
            <Grid.Column key={post.id} style={{marginBottom: '20px'}}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        }
    </Grid.Row>
  </Grid>
  );
};

export default Home;

