import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import mongoose from 'mongoose'
import path from 'path'
import cors from 'cors'
import config from './config'
import models from './models'
import auth from './helpers/auth'


const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')))
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const app = express()
app.set('port', config.port)

app.use(auth.checkHeaders)

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
  next()
})

app.use(cors())

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      secret: config.SECRET_TOKEN,
      user: req.user,
    },
  })),
)

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

mongoose.connect(config.db, (err) => {
  if (err) throw err
  console.log('Db connection established')

  app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost:${app.get('port')}`)
  })
})
