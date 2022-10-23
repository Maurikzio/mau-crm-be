const typeDefs = `#graphql
  type User {
    id: ID
    name: String
    lastname: String
    email: String
    # password: String -> no queremos que nos retorne el pwd al crear un nuevo usuario.
    createdWhen: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  type Query {
    getBooks: String
  }

  type Mutation {
    newUser(input: UserInput): User #User
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