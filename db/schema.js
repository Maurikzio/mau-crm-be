const typeDefs = `
  type Book {
    title: String
    author: String
  }

  Query {
    getBooks: [Book]
  }
`

export default typeDefs;