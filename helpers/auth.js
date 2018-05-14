import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config'
import models from '../models'

const auth = {

  getToken: ({ _id }) => {
    const newToken = jwt.sign({ user: _id }, config.SECRET_TOKEN, { expiresIn: '5d' })

    return [newToken]
  },


  login: async (username, password, User) => {
    const user = await User.findOne({ username })
    if (!user) {
      return {
        ok: false,
        errors: [{
          path: 'username',
          message: "Username doesn't exists",
        }],
      }
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return {
        ok: false,
        errors: [{
          path: 'password',
          message: 'Invalid password',
        }],
      }
    }


    const [newToken] = auth.getToken(user, config.SECRET_TOKEN)

    return {
      ok: true,
      token: newToken,
    }
  },

  checkHeaders: async (req, res, next) => {
    if (req.headers.authorization) {
      const { 1: token } = req.headers.authorization.split(' ')

      if (token) {
        try {
          const { user } = jwt.verify(token, config.SECRET_TOKEN)
          req.user = user
        } catch (error) {
          const newToken = await auth.checkToken(token)
          req.user = newToken.user
          if (newToken.token) {
            res.set('Access-Control-Expose-Headers', 'Authorization')
            res.set('Authorization', newToken.token)
          }
        }
      }
    }
    next()
  },
  checkToken: async (token) => {
    let idUser = null
    try {
      const { user } = await jwt.decode(token)
      idUser = user
    } catch (error) {
      return {}
    }
    const user = await models.User.findOne({ _id: idUser })
    const [newToken] = auth.getToken(user)

    return {
      user: user._id,
      token: newToken,
    }
  },
}

export default auth
