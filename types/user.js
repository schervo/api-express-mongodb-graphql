export default `

  type User{
    _id: ID!
    username: String!
    password: String!
    fullname: String!
    thumbnail: String
    email: String!
  }

  type Query{
    users: [User]!
    getUser(_id: ID!): User!
  }

  type Mutation{

    login(username: String!, password: String!): Response!

    createUser(username: String!, password: String!, fullname: String!, email: String!): Response!
  }



`
