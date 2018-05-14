import { GraphQLUpload } from 'apollo-upload-server'
import { processUpload } from '../helpers'


export default {
  Upload: GraphQLUpload,
  Query: {
    getPost: (parent, args, { models }) => models.Post.findOne(args),
  },
  Mutation: {
    createPost: (parent, args, { models, user }) => models.Post.create({ ...args.post, by: user }),
    singleUpload: (obj, { file }) => processUpload(file),
  },
}
