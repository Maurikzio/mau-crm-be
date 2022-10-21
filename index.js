import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./db/schema.js";
import resolvers from "./db/resolvers.js";
import connectDB from "./config/db.js";

connectDB();


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`🚀 Server ready at ${url}`)