import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./db/schema.js";
import resolvers from "./db/resolvers.js";
import connectDB from "./config/db.js";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config({ path: 'variables.env'});

connectDB();


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res}) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_W);
        return { user }
      } catch (err) {
        console.log("User not found")
        throw new Error(err);
      }
    }
  }
});

console.log(`🚀 Server ready at ${url}`)