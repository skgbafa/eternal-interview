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
    updateName: (_: any, { name }: any, { dataSources, user }: any) => dataSources.userDatasource.updateName(user, name),
    updateEmail: (_: any, { email }: any, { dataSources, user }: any) => dataSources.userDatasource.updateEmail(user, email),
    updateWalletAddress: (_: any, { walletAddress }: any, { dataSources, user }: any) => dataSources.userDatasource.updateWalletAddress(user, walletAddress),
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
