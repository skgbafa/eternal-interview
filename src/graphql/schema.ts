import { makeExecutableSchema } from '@graphql-tools/schema';
import 'graphql-import-node';

import * as userTypeDefs from '../../schemas/user.graphql';
import * as emptyTypeDefs from '../../schemas/empty.graphql';

import userResolver from './resolvers/user';

const typeDefs = [userTypeDefs, emptyTypeDefs];
const resolvers = [userResolver];

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default schema;
