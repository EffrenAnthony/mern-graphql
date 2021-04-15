const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')
const User = require('../../models/User')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { config } = require('../../config')

function generateToken(user){
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, config.SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
  Mutation: {
    async login(_, { username, password }){
      const { errors, valid } = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })
      if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('Wrong credentials', { errors })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = generateToken(user) 
      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    async register(_, { registerInput: {username, email, password, confirmPassword}},
      // context,
      // info
      ){

      // Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // TODO Make sure user doesn't already exist
        // findOne es metodo de mongo db
      const user = await User.findOne({ username })
      // const email = await User.findOne({ email })
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }
      // TODO hash password and create an auth token
      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      })
      // retornar el usuario y lo guardamos, con save creamos el nuevo usuario en mongoDB
      const res = await newUser.save()

      // generamos el token
      const token = generateToken(res)

      // finalmente al usuario le mostramos todo el contenido del res mas el id y el token
      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
}