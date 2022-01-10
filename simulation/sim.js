/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');
const fetch = require('node-fetch');
const ObjectsToCsv = require('objects-to-csv');

const {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
  concat,
  gql,
} = require('@apollo/client');

const config = {
  uri: 'https://eternal-interveiw.herokuapp.com/graphql',
  num_users: 10,
  num_follows: 5,
};

class User {
  constructor(name, email, password, wallet) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.wallet = wallet;

    this._id = null;
    this.token = null;

    this.authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: this.token ? `Bearer ${this.token}` : null,
        },
      }));
      return forward(operation);
    });
    this.httpLink = new HttpLink({ uri: config.uri, fetch });

    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: concat(this.authMiddleware, this.httpLink),
    });
  }

  async register() {
    // console.log('registering user');
    const { data } = await this.client.mutate({
      mutation: gql`
      mutation register($name: String!, $email: String!, $password: String!, $walletAddress: String!) {
        register (name: $name, email: $email, password: $password, walletAddress: $walletAddress) {
          success
          token
          message
          user {
            _id
            email
            name
            walletAddress
            followerCount
            followers{
              name
            }
          }
        }
      }`,
      variables: {
        name: this.name,
        email: this.email,
        password: this.password,
        walletAddress: this.wallet,
      },
    });

    if (data.register.success) {
      this.updateAuth(data.register.token);
      this.updateUser(data.register.user);
    }
  }

  async login() {
    // console.log('logging in user');
    const { data } = await this.client.mutate({
      mutation: gql`
      query login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          success
          token
          message
        }
      }
      `,
      variables: {
        email: this.email,
        password: this.password,
      },
    });

    if (data.login.success) {
      this.updateAuth(data.login.token);
    }
  }

  async follow(userId) {
    try {
      // console.log(`${this._id} following ${userId}`);
      const { data } = await this.client.mutate({
        mutation: gql`
      mutation followUser($personToFollow:ID!) {
        followUser(userId: $personToFollow) {
          success
          message
        }
      }
      `,
        variables: {
          personToFollow: userId,
        },
      });

      // console.log(data.followUser.message);
    } catch (error) {
      console.log(error);
      // console.error(error.networkError.result.errors[0].message);
    }
  }

  async getUser() {
    try {
      // console.log('getting user data');

      const { data } = await this.client.query({
        query: gql`
        query getUser($id: ID!){
          getUser(id: $id) {
            success
            message
            user {
              _id
              name
              email
              walletAddress
              followerCount
              followers {
                  name
              }
            }
          }
        }
        `,
        variables: {
          id: this._id,
        },
      });

      if (data.getUser.success) {
        this.updateUser(data.getUser.user);
      }
    } catch (error) {
      console.log(error);
      // console.error(error.networkError.result.errors[0].message);
    }
  }

  updateAuth(token) {
    this.token = token;
  }

  updateUser(user) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.wallet = user.walletAddress;
    this.followerCount = user.followerCount;
  }

  getData() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      password: this.password,
      wallet: this.wallet,
      followerCount: this.followerCount,
    };
  }
}

const createUser = async () => {
  const user = new User(
    faker.name.findName(),
    faker.internet.email(),
    'eternal123',
    faker.finance.ethereumAddress(),
  );
  return user;
};

const main = async () => {
  const user = await createUser();
  await user.register();
  await user.login();
  await user.follow('61dcb5e0d361512f04e16e5d');
  await user.getUser();
  console.log(user.getData());
};

const runSim = async () => {
  console.log(`[SIM] Running simulation with ${config.num_users} users`);
  // create users
  console.log(`[SIM]  Creating and registering users on ${config.uri}`);
  const users = await Promise.all(Array(config.num_users).fill(0).map(() => createUser()));
  // register them
  await Promise.all(users.map(async (user) => user.register()));
  console.log(`[SIM] Each user is following ${config.num_follows} of their peers`);
  // for each user, follow 5 people
  await Promise.all(users.map(async (user) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < config.num_follows; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      // eslint-disable-next-line no-await-in-loop
      await user.follow(randomUser._id);
    }
  }));

  // update users
  await Promise.all(users.map(async (user) => user.getUser()));
  console.log('[SIM] Fetching updated user data');
  // save users to csv
  const csvData = users.map((user) => user.getData());
  const csv = new ObjectsToCsv(csvData);
  await csv.toDisk('./sim.csv');
  console.log('[SIM] User data saved to sim.csv');
};

runSim().then(() => {
  console.log('Simulation completed');
});
