import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import axios from "axios";

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `

        type User {
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }

        type Todo {
            id: ID!
            title: String!
            completed: Boolean
            user:User
        }

        type Query {
            getTodos: [Todo]
            getUsers: [User]
            getUser(id: ID!): User
        }
    `,
    resolvers: {
      Todo: {
        user: async (todo) => {
          const res = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
          );
          return res.data;
        },
      },
      Query: {
        getTodos: async () => {
          const res = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
          );
          return res.data;
        },
        getUsers: async () => {
          const res = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
          );
          return res.data;
        },
        getUser: async (parent, { id }) => {
          const res = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );
          return res.data;
        },
      },
    },
  });

  app.use(express.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => {
    console.log(`Server listening on port ${8000}`);
  });
}

startServer();
