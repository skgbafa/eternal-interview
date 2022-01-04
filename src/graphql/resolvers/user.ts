const resolvers = {
  Mutation: {
    register: (_: any, {
      name, email, password, walletAddress,
    }: any, { dataSources }: any) => dataSources.userDatasource.register(name, email, password, walletAddress),
  },
  Query: {
    login: (_: any, { email, password }: any, { dataSources }: any) => dataSources.userDatasource.login(email, password),
  },
};

export default resolvers;
