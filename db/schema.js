const typeDefs = `#graphql
  type User {
    id: ID
    name: String
    lastname: String
    email: String
    # password: String -> no queremos que nos retorne el pwd al crear un nuevo usuario.
    createdWhen: String
  }

  type Token {
    token: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  type Query {
    getUserInfo(token: String!): User
  }

  type Mutation {
    newUser(input: UserInput): User #User
    authenticateUser(input: AuthInput): Token
  }
`

export default typeDefs;

/**
 * Int,
 * Float,
 * Boolean,
 * String,
 * ID,
 */