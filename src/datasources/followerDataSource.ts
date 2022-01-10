/* eslint-disable @typescript-eslint/no-empty-function */
import { DataSource } from 'apollo-datasource';
import { DBConnection } from '../connections/types';

class FollowerDataSource extends DataSource {
  private mongoDBConnection: DBConnection;

  constructor(mongoDBConnection: DBConnection) {
    super();
    this.mongoDBConnection = mongoDBConnection;
  }

  public follow(leader: string, follower: string) {

  }

  public unfollow(leader: string, follower: string) {

  }

  public async getFollowers(leader: string) {
    const followers = await this.mongoDBConnection.getFollowers(leader);
    return {
      followers,
      followerCount: followers.length,
    };
  }
}

export default FollowerDataSource;
