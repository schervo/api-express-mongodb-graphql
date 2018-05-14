export default {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/name-of-your-database',
  SECRET_TOKEN: 'private',
}
