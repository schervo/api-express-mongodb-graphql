import mongoose from 'mongoose'
import validate from 'mongoose-validator'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true],
    validate: validate({
      validator: 'isLength',
      arguments: [6, 8],
      message: 'The username must be between {ARGS[0]} and {ARGS[1]} characters long',
    }),
  },
  password: String,
  email: {
    type: String,
    validate: validate({
      validator: 'isEmail',
      message: 'Please enter a valid email',
    }),
  },
  fullname: String,
  desc: String,
  bio: String,
  thumbnail: String,
  posts: {
    type: [],
    default: [],
  },
  following: {
    type: [],
    default: [],
  },
  followers: {
    type: [],
    default: [],
  },

})

const userModel = mongoose.model('User', userSchema)

export default userModel
