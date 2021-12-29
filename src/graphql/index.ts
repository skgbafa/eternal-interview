import { ApolloServer, gql} from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
  
import UserDataSource from '../datasources/userDataSource';
import FollowerDataSource from '../datasources/followerDataSource';

import schema  from './schema';

export default async (app: any, context: any) => {

  const { config, mongoDBConnection } = context;
  const userDataSource = new UserDataSource(mongoDBConnection);
  const followerDataSource = new FollowerDataSource(mongoDBConnection);

  const server = new ApolloServer({
    // context: ({ req }: any) => {
    //   return {};
    // },
    dataSources: () => ({
      userDatasource: userDataSource,
      followerDatasource: followerDataSource,
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
