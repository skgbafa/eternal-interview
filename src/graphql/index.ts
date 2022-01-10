import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

import UserDataSource from '../datasources/userDataSource';
import FollowerDataSource from '../datasources/followerDataSource';

import schema from './schema';

export default async (app: any, context: any) => {
  const { mongoDBConnection } = context;
  const followerDataSource = new FollowerDataSource(mongoDBConnection);
  const userDataSource = new UserDataSource(mongoDBConnection, followerDataSource);

  const server = new ApolloServer({
    context: ({ req }: any) => ({ user: req.user }),
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
