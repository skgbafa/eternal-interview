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

  public async getUserById(_id: ObjectId): Promise<any> {
    if (!this.collections.users) {
      throw new Error('Database connection not established');
    }
    const query = { _id: new ObjectId(_id) };
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

  public async updateUserData(user: User): Promise<any> {
    if (!this.collections.users) {
      throw new Error('Database connection not established');
    }
    const query = { _id: new ObjectId(user._id) };
    const updateData = { ...user };
    delete updateData._id;
    const result = await this.collections.users.findOneAndUpdate(query, { $set: updateData }, { returnDocument: 'after' });
    return result.value;
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

  public async getUserByEmail(email: string): Promise<any> {
    if (!this.collections.users) {
      throw new Error('Database connection not established');
    }
    const query = { email };
    const user = await this.collections.users.findOne(query);
    return user;
  }

  public async createFollower(follower: Follower): Promise<any> {
    if (!this.collections.followers) {
      throw new Error('Database connection not established');
    }
    const result = await this.collections.followers.insertOne(follower);
    return result;
  }

  public async deleteFollower(follower: Follower): Promise<any> {
    if (!this.collections.followers) {
      throw new Error('Database connection not established');
    }
    // const query = { leader, follower };
    // console.log(query);
    const result = await this.collections.followers.findOneAndDelete(follower);
    return result.value;
  }

  public async checkIfFollowing(leader: ObjectId, follower: ObjectId): Promise<any> {
    if (!this.collections.followers) {
      throw new Error('Database connection not established');
    }
    const query = { leader, follower };
    const result = await this.collections.followers.findOne(query);
    return result;
  }

  public async getFollowers(leader: ObjectId): Promise<any> {
    if (!this.collections.followers) {
      throw new Error('Database connection not established');
    }
    const query = { leader };
    const followers = await this.collections.followers.find(query).toArray();
    return followers;
  }
}

export default MongoDBConnection;
// export { MongoDBConnection, User, Follower, DBConnection };
