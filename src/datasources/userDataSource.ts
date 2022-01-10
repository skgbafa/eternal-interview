import { DataSource } from 'apollo-datasource';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import config from '../config';
import { DBConnection, User } from '../connections/types';
import FollowerDataSource from './followerDataSource';

class UserDataSource extends DataSource {
  private mongoDBConnection: DBConnection;

  private followerDataSource: FollowerDataSource;

  constructor(mongoDBConnection: DBConnection, followerDataSource: FollowerDataSource) {
    super();
    this.mongoDBConnection = mongoDBConnection;
    this.followerDataSource = followerDataSource;
  }

  public async register(name:string, email:string, password:string, walletAddress: string) {
    try {
      // validate inputs
      if (!validator.isAlpha(name)) {
        throw new Error('Invalid Name');
      }
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
      }
      if (!validator.isLength(password, { min: config.password.minLength })) {
        // could do more validation with isStrongPassword
        throw new Error('Password must be at least 8 characters long');
      }
      if (!validator.isHexadecimal(walletAddress)) { // could also check for eth address
        throw new Error('Invalid wallet address');
      }

      // hash password
      const hash = await bcrypt.hash(password, config.password.hashRounds);

      // create user and update database
      const userData = new User(name, email, hash, walletAddress);
      const user = await this.mongoDBConnection.createUser(userData);
      const userWithFollowers = await this.addFollowersToUser(user);

      return {
        success: true,
        message: 'User created successfully',
        token: UserDataSource.signToken(user),
        user: userWithFollowers,
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';

      return {
        success: false,
        message,
        token: null,
        user: null,
      };
    }
  }

  public async login(email: string, password: string) {
    try {
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
      }

      const user = await this.mongoDBConnection.login(email, password);

      if (!user) {
        throw new Error('Invalid email or password');
      }
      const userWithFollowers = await this.addFollowersToUser(user);
      return {
        success: true,
        message: 'User logged in successfully',
        token: UserDataSource.signToken(user),
        user: userWithFollowers,
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';
      return {
        success: false,
        message,
        token: null,
        user: null,
      };
    }
  }

  public async getUser(id: ObjectId) {
    try {
      const user = await this.mongoDBConnection.getUserById(id);
      const userWithFollowers = await this.addFollowersToUser(user);
      return {
        success: true,
        user: userWithFollowers,
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';
      return {
        success: false,
        message,
        user: null,
      };
    }
  }

  public async updateName(user: User, name: string) {
    try {
      if (!validator.isAlpha(name)) {
        throw new Error('Invalid Name');
      }
      const updateData = { _id: user._id, name };
      const updatedUser = await this.mongoDBConnection.updateUserData(updateData);
      const userWithFollowers = await this.addFollowersToUser(updatedUser);
      return {
        success: true,
        user: userWithFollowers,
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';
      return {
        success: false,
        message,
        user: null,
      };
    }
  }

  public async updateEmail(user: User, email: string) {
    try {
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
      }

      const existingUser = await this.checkIfEmailExists(email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const updateData = { _id: user._id, email };
      const updatedUser = await this.mongoDBConnection.updateUserData(updateData);
      const userWithFollowers = await this.addFollowersToUser(updatedUser);
      return {
        success: true,
        user: userWithFollowers,
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';
      return {
        success: false,
        message,
        user: null,
      };
    }
  }

  public async updateWalletAddress(user: User, walletAddress: string) {
    try {
      if (!validator.isHexadecimal(walletAddress)) { // could also check for eth address
        throw new Error('Invalid wallet address');
      }
      const updateData = { _id: user._id, walletAddress };
      const updatedUser = await this.mongoDBConnection.updateUserData(updateData);
      const userWithFollowers = await this.addFollowersToUser(updatedUser);
      return {
        success: true,
        user: userWithFollowers,
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';
      return {
        success: false,
        message,
        user: null,
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async updatePassword(user: User, oldPassword: string, newPassword: string) {
    // will skip for now
    // check new password valid
    // check old password
    // hash new password
    // update password
    return {};
  }

  private async addFollowersToUser(user: User) {
    const followerData = await this.followerDataSource.getFollowers(user._id);
    return { ...user, ...followerData };
  }

  private checkIfEmailExists(email: string) {
    return this.mongoDBConnection.getUserByEmail(email);
  }

  static signToken(user: User) {
    return jwt.sign({ _id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }
}

export default UserDataSource;
