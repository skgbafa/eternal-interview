/* eslint-disable @typescript-eslint/no-empty-function */
import { DataSource } from 'apollo-datasource';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { MongoDBConnection, User } from '../connections/MongoDBConnection';
import config from '../config';


class UserDataSource extends DataSource {
  private mongoDBConnection: MongoDBConnection;
  constructor(mongoDBConnection: MongoDBConnection) {
    super();
    this.mongoDBConnection = mongoDBConnection;
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
      if (!validator.isLength(password, { min: config.password.minLength })) { // could do more validation with isStrongPassword
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

      return {
        success: true,
        message: 'User created successfully',
        token: this.signToken(user),
        user: user,
      };
    
    } catch (error) {
      const  message = error && (error as Error).message || 'Unknown error';
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

      return {
        success: true,
        message: 'User created successfully',
        token: this.signToken(user),
        user,
      };        


    } catch (error) {
      const  message = error && (error as Error).message || 'Unknown error';
      return {
        success: false,
        message,
        token: null,
        user: null,
      };
    }
   

  }

  public getUser() {
  }

  public updateUser() {

  }

  private signToken(user: User) {
    return jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

}

export default UserDataSource;
