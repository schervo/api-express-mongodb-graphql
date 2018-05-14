import bcrypt from 'bcrypt'
import { formatErrors } from '../utils'
import {
  auth,
  isAuthenticatedResolver,
} from '../helpers'


export default {
  Query: {
    // allUsers: isAuthenticatedResolver.createResolver((parent, args, { models }) =>
    //   models.User.find()),
    users: (parent, args, { models }) => models.User.find(),
    getUser: (parent, args, { models }) => models.User.findOne(args),
  },
  Mutation: {
    login: async (parent, { username, password }, { models: { User }, secret }) =>
      auth.login(username, password, User, secret),


    createUser: async (parent, { password, ...args }, { models }) => {
      const otherErrors = []
      try {
        if (password.length < 8) {
          otherErrors.push({ path: 'password', message: 'Password debe ser mayor a 8 caracteres' })
        }

        if (otherErrors.length) {
          throw otherErrors
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await models.User.create({ ...args, password: hashPassword })


        return {
          ok: user && user._id,
          errors: [],
        }
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, otherErrors),
        }
      }
    },
  },
}
