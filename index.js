const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const {config} = require('./config/index');
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // permitirá utilizar el request de body en nuestro contexto, para poder hace peticiones privadas o solo autenticadas
  context: ({ req }) => ({ req, pubsub })
})

mongoose.connect(config.mongodb, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false})
.then(()=>{
  console.log('Mongo DB Connected');
  return server.listen({ port: config.port })  
}).then(res => {
  console.log(`Server running at ${res.url}`);
})

