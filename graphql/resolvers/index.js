const postsResolvers = require('./posts')
const userResolvers = require('./users')
const commentsResolvers = require('./comments')

module.exports = {
  // aqui y donde sera, el parente es la data que viene de get post en este caso
  Post:{
    likeCount(parent) {
      // console.log(parent);
      return parent.likes.length
    },
    commentCount: (parent) => parent.comments.length
  },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
}