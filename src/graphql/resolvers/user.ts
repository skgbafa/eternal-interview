const resolvers = {
  Mutation: {
    register: (_: any, { name, email, password, walletAddress }: any, { dataSources }: any) => {
      return dataSources.userDatasource.register(name, email, password, walletAddress);
    }
  },
  Query: {
  },
};
  
export default resolvers;
  