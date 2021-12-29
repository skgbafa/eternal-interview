/* eslint-disable @typescript-eslint/no-empty-function */
import { DataSource } from 'apollo-datasource';
import validator from 'validator';

import { MongoDBConnection, User } from '../connections/MongoDBConnection';
import bcrypt from 'bcrypt';
import config from '../config';


class UserDataSource extends DataSource {
  private mongoDBConnection: MongoDBConnection;
  constructor(mongoDBConnection: MongoDBConnection) {
    super();
    this.mongoDBConnection = mongoDBConnection;
  }
  
  public async register(name:string, email:string, password:string, walletAddress: string) {
    try {
      if (!validator.isAlpha(name)) {
        throw new Error('Invalid Name');
      }
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
      }
      // validator.isStrongPassword(password) if we want to add more validation
      if (!validator.isLength(password, { min: config.password.minLength })) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (!validator.isHexadecimal(walletAddress)) {
        throw new Error('Invalid wallet address');
      }

      // hash password
      const hash = await bcrypt.hash(password, config.password.hashRounds);
      

      // create user object
      const user = new User(name, email, hash, walletAddress);
      console.log(user);
      const newUser = await this.mongoDBConnection.createUser(user);
      console.log(newUser);
      return {
        success: true,
        message: 'User created successfully',
        token: '',
        user: newUser,
      }
    
      // insert user into database
      console.log(name);
    } catch (error) {
      const  message = error && (error as Error).message || 'Unknown error';
      return {
        success: false,
        message,
        token: null,
        user: null,
      };}
    

   
  
  }

  public login(email: string, password: string) {
    console.log(email);
  
  }

  public getUser() {
  }

  public updateUser() {

  }

}

export default UserDataSource;
