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

  type Client {
    id: ID
    name: String
    lastname:  String
    company: String
    email: String
    phone: String
    seller: ID
  }

  type Order {
    id: ID!
    order: [OrderGroup]
    total: Float
    client: ID
    seller: ID
    createdWhen: String
    status: OrderStatus!
  }

  type OrderGroup {
    id: ID!
    quantity: Int
  }

  type TopClient {
    total: Float
    client: [Client]
  }

  type TopSeller {
    total: Float
    seller: [User]
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

  input ClientInput {
    name: String!
    lastname: String!
    company: String!
    email: String!
    phone: String
  # seller: ----> no lo pasamos manualmente sino que sera el User q este autenticado y lo tomaremos del context
  }

  input OrderProductInput {
    id: ID
    quantity: Int
  }

  input OrderInput {
    order: [OrderProductInput]
    total: Float
    client: ID
    status: OrderStatus
  }

  enum OrderStatus {
    PENDING
    COMPLETED
    CANCELLED
  }


  type Query {
    #users
    getUserInfo(token: String!): User

    #products
    getAllProducts: [Product]
    getProductById(id: ID!): Product

    #clients
    getAllClients: [Client]
    getClientsBySeller: [Client] #Seller is the current logged in user.
    getClient(id: ID): Client

    #orders
    getAllOrders: [Order]
    getOrdersBySeller: [Order] # Seller is the current logged in user.
    getOrder(id: ID!): Order
    getOrdersByStatus(status: OrderStatus): [Order]

     #advanced
     bestClients: [TopClient]
     bestSellers: [TopSeller]
     searchProduct(searchText: String!): [Product]
  }

  type Mutation {
    # Users
    newUser(input: UserInput): User #User
    authenticateUser(input: AuthInput): Token

    # Products
    createNewProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id: ID!): String

    # Client
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput!): Client
    deleteClient(id: ID!): String

    # Orders
    newOrder(input: OrderInput): Order
    updateOrder(id: ID!, input: OrderInput!): Order
    deleteOrder(id: ID!): String
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