import { ApolloServer, gql} from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
  
import schema  from './schema';
// import { typeDefs } from "./graphql/schema";
// import { resolvers } from "./graphql/resolvers";


export default async (app: any, context: any) => {

  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    type Query {
    hello: String
    }
    `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      hello: () => 'Hello world!',
    },
  };
    // const server = new ApolloServer({ typeDefs, resolvers });

  // server.applyMiddleware({ app });

  const server = new ApolloServer({
    // context: ({ req }: any) => {
    //   return {};
    // },
    dataSources: () => ({
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    schema,
  });
    
  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
  });

  return ;
    
};
