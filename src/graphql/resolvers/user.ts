const validateUser = (user: any) => {
  if (!user) {
    throw new Error('Must be authenticated.');
  }
};

const resolvers = {
  Mutation: {
    register: (_: any, {
      name, email, password, walletAddress,
    }: any, { dataSources }: any) => dataSources.userDatasource.register(name, email, password, walletAddress),
  },
  Query: {
    login: (_: any, { email, password }: any, { dataSources }: any) => dataSources.userDatasource.login(email, password),
    getUser: (_: any, { id }: any, { dataSources, user }: any) => {
      validateUser(user);
      return dataSources.userDatasource.getUser(id);
    },
  },
};

export default resolvers;
