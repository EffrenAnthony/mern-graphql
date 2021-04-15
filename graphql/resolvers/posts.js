const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')
const { AuthenticationError, UserInputError } = require('apollo-server')
module.exports = {
  Query:{
    // sayHi:() => 'Hello World!!!!!'
    async getPosts(){
      try{
        //intentará buscar el modelo post, todos los del modelo post
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
      }
      catch (err) {
        throw new Error(err)
      }
    },
    async getPost(_,{ postId }){
      try{
        const post = await Post.findById(postId);
        if (post) {
          return post;
        }else {
          throw new Error('Post not found')
        }
      }catch (err){
        throw new Error(err)
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context){
      // en esta linea validamos el context dde check auth, si hubiese algun error, check auth nos mostraria el error y el resto de lineas quedaría sin ocurrir
      const user = checkAuth(context)
      console.log(user);

      if (body.trim()==='') {
        throw new Error('post body must not be empty')
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString() 
      })

      const post = await newPost.save()
      // subscription
      context.pubsub.publish('NEW_POST', {
        newPost: post
      })
      // subscription/
      return post
    },
    async deletePost(_, { postId }, context){
      const user = checkAuth(context)
      // haremos que el único que pueda borrar sea el dueño del post
      try{
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete()
          return 'Post deleted successfully'
        }else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch(err){
        throw new Error(err)
      }
    },
    async likePost(_, { postId }, context){
      const { username } = checkAuth(context)
      const post = await Post.findById(postId)
      if (post) {
        if(post.likes.find(like => like.username === username)){
          // post already likes, unlike it
          // dejaremos todos los que no sean este usuario
          post.likes = post.likes.filter(like => like.username !== username)
        }else{
          // not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }
        await post.save()
        return post

      }else throw new UserInputError('Post not found')
    }
  },
  Subscription:{
    newPost: {
      subscribe: (_, __, { pubsub }) => {
        // convecion para recibir data
        return pubsub.asyncIterator('NEW_POST')
      }
    }
  }
}