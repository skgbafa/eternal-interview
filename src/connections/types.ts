/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-useless-constructor */
import { ObjectId } from 'mongodb';

class User {
  constructor(
    public name: string,
    public email: string,
    private password: string,
    public walletAddress: string,
    public followerCount: number = 0,
    public followers: Array<User> = [],
    public _id?: ObjectId,
  ) {}
}

class Follower {
  constructor(
    public leader: ObjectId,
    public follower: ObjectId,
    public id?: ObjectId,
  ) {}
}

interface DBConnection {
  getUserById(id: string): Promise<any>;
  createUser(user: User): Promise<any>;
  login(email: string, givenPassword: string): Promise<any>;
  createFollower(follower: Follower): Promise<any>;
}

export { User, Follower, DBConnection };
