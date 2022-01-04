import bcrypt from 'bcrypt';
import * as mongoDB from 'mongodb';
import { ObjectId, Collection } from 'mongodb';

import { User, Follower, DBConnection } from './types';

class MongoDBConnection implements DBConnection {
  private client: mongoDB.MongoClient;

  private database: mongoDB.Db | undefined;

  private collections: {
    users?: Collection;
    followers?: Collection;
  } = {};

  constructor(config: any) {
    const {
      username, password, host, databaseName, collectionNames,
    } = config.mongoDB;
    const connectionString = `mongodb+srv://${username}:${password}@${host}`;

    this.client = new mongoDB.MongoClient(connectionString);
    this.client.connect().then(() => {
      this.database = this.client.db(databaseName);
      this.collections.users = this.database.collection(collectionNames.users);
      this.collections.followers = this.database.collection(collectionNames.followers);
      console.log(`Successfully connected to database: ${this.database.databaseName}`);
    }).catch((err) => {
      console.log('Failed to connect to database');
      console.log(err);
    });
  }

  public async getUserById(id: string): Promise<any> {
    if (!this.collections.users) {
      throw new Error('Database connection not established');
    }
    const query = { _id: new ObjectId(id) };
    const user = await this.collections.users.findOne(query);
    return user;
  }

  public async createUser(user: User): Promise<any> {
    if (!this.collections.users) {
      throw new Error('Database connection not established');
    }
    const existingUser = await this.collections.users.findOne({ email: user.email });
    if (existingUser) {
      throw new Error(`User with email ${user.email} already exists`);
    }
    const result = await this.collections.users.insertOne(user);
    return this.collections.users.findOne({ _id: result.insertedId });
  }

  public async login(email: string, givenPassword: string): Promise<any> {
    if (!this.collections.users) {
      throw new Error('Database connection not established');
    }
    const query = { email };
    const user = await this.collections.users.findOne(query);
    if (user) {
      const { password } = user;
      if (bcrypt.compareSync(givenPassword, password)) {
        return user;
      }
    }
    return null;
  }

  public async createFollower(follower: Follower): Promise<any> {
    if (!this.collections.followers) {
      throw new Error('Database connection not established');
    }
    const result = await this.collections.followers.insertOne(follower);
    return result;
  }
}

export default MongoDBConnection;
// export { MongoDBConnection, User, Follower, DBConnection };
