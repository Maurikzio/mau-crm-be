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

  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
    createdWhen: String
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

  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }


  type Query {
    #users
    getUserInfo(token: String!): User

    #products
    getAllProducts: [Product]
    getProductById(id: ID!): Product
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User #User
    authenticateUser(input: AuthInput): Token

    # Products
    createNewProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String
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