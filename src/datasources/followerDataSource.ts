import validator from 'validator';
import { DataSource } from 'apollo-datasource';
import { ObjectId } from 'mongodb';
import { DBConnection, Follower } from '../connections/types';

class FollowerDataSource extends DataSource {
  private mongoDBConnection: DBConnection;

  constructor(mongoDBConnection: DBConnection) {
    super();
    this.mongoDBConnection = mongoDBConnection;
  }

  public async followUser(leader: ObjectId, follower: ObjectId) {
    try {
      if (!validator.isMongoId(leader.toString())) {
        throw new Error('Invalid id to follow');
      }
      const leaderExists = await this.mongoDBConnection.getUserById(leader);
      if (!leaderExists) {
        throw new Error(`Id ${leader} does not exist`);
      }
      const isAlreadyFollowing = await this.mongoDBConnection.checkIfFollowing(leader, follower);
      if (isAlreadyFollowing) {
        throw new Error('Already following user');
      }
      const followerData = new Follower(leader, follower);
      const response = await this.mongoDBConnection.createFollower(followerData);
      if (!response.insertedId) {
        throw new Error('Failed to follow user');
      }
      return {
        success: true,
        message: 'User followed successfully',
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';
      return {
        success: false,
        message,
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async unfollowUser(leader: ObjectId, follower: ObjectId) {
    try {
      if (!validator.isMongoId(leader.toString())) {
        throw new Error('Invalid id to unfollow');
      }

      const followerData = new Follower(leader, follower);
      const response = await this.mongoDBConnection.deleteFollower(followerData);
      if (!response) {
        throw new Error('Follow record does not exist');
      }
      return {
        success: true,
        message: 'User unfollowed successfully',
      };
    } catch (error) {
      const message = (error && (error as Error).message) || 'Unknown error';
      return {
        success: false,
        message,
      };
    }
  }

  public async getFollowers(leader?: ObjectId) {
    if (!leader) {
      return {
        followers: [],
        followerCount: 0,
      };
    }

    try {
      const followers = await this.mongoDBConnection.getFollowers(leader);
      return {
        followers,
        followerCount: followers.length,
      };
    } catch (error) {
      return {
        followers: [],
        followerCount: 0,
      };
    }
  }
}

export default FollowerDataSource;
