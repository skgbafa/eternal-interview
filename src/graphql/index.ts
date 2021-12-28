import { ApolloServer, gql} from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
  
import schema  from './schema';

export default async (app: any, context: any) => {

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
};
