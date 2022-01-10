/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-useless-constructor */
import { ObjectId } from 'mongodb';

class User {
  constructor(
    public name?: string,
    public email?: string,
    private password?: string,
    public walletAddress?: string,
    public followerCount?: number,
    public followers?: Array<User>,
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
  createUser(user: User): Promise<any>;
  login(email: string, givenPassword: string): Promise<any>;
  getUserById(id: ObjectId): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  updateUserData(user: User): Promise<any>;
  createFollower(follower: Follower): Promise<any>;
  deleteFollower(followerData: Follower): Promise<any>;
  checkIfFollowing(leader: ObjectId, follower: ObjectId): Promise<any>;
  getFollowers(userId: ObjectId): Promise<any>;
}

export { User, Follower, DBConnection };
