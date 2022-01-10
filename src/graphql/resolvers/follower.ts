const validateUser = (user: any) => {
  if (!user) {
    throw new Error('Must be authenticated.');
  }
};

const resolvers = {
  Mutation: {
    followUser: (_: any, { userId }: any, { dataSources, user }: any) => {
      validateUser(user);
      return dataSources.followerDatasource.followUser(userId, user._id);
    },
    unfollowUser: (_: any, { userId }: any, { dataSources, user }: any) => {
      validateUser(user);
      return dataSources.followerDatasource.unfollowUser(userId, user._id);
    },
  },
  Query: {

  },
};

export default resolvers;
