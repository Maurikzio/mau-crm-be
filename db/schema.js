const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    getBooks: [Book]
  }
`

export default typeDefs;