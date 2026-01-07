import { ApolloServer } from "npm:@apollo/server";
import { startStandaloneServer } from "npm:@apollo/server/standalone";
import { MongoClient } from "mongodb";

import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { ropaModel, carritoModel } from "./types.ts";
import { Context } from "./context.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL)
{
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("RopaDB");
const ropaCollections= mongoDB.collection<ropaModel>("Ropa");
const carritoCollections= mongoDB.collection<carritoModel>("Carrito");

// Populate initial data if empty
const count = await ropaCollections.countDocuments();
console.log(`Current count in ropa collection: ${count}`);
if (count === 0) {
  try {
    await ropaCollections.insertMany([
      { nombre: "Camiseta", precio: 20, tipo: "ropa", favorito: false },
      { nombre: "Pantalón", precio: 50, tipo: "ropa", favorito: false },
      { nombre: "Zapatos", precio: 80, tipo: "ropa", favorito: false }
    ]);
    console.log("Initial ropa data inserted");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
} else {
  console.log("Data already exists, skipping insertion");
}

const server = new ApolloServer<Context>({
  typeDefs: schema,
  resolvers,
});

const port = parseInt(Deno.env.get("PORT") || "4000");

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: () => Promise.resolve({ ropaCollections, carritoCollections }),
});

console.log(`🚀  Server ready at: ${url}`);