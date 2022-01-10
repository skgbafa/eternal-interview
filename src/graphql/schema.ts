import { makeExecutableSchema } from '@graphql-tools/schema';
import 'graphql-import-node';

import * as userTypeDefs from '../../schemas/user.graphql';
import * as followerTypeDefs from '../../schemas/follower.graphql';
import * as emptyTypeDefs from '../../schemas/empty.graphql';

import userResolver from './resolvers/user';
import followerResolver from './resolvers/follower';

const typeDefs = [userTypeDefs, followerTypeDefs, emptyTypeDefs];
const resolvers = [userResolver, followerResolver];

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default schema;
