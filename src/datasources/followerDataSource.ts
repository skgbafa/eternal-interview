/* eslint-disable @typescript-eslint/no-empty-function */
import { DataSource } from 'apollo-datasource';
import MongoDBConnection from '../connections/MongoDBConnection';

class FollowerDataSource extends DataSource {

  private mongoDBConnection: MongoDBConnection;
  constructor(mongoDBConnection: MongoDBConnection) {
    super();
    this.mongoDBConnection = mongoDBConnection;
  }

  public follow(leader: string, follower: string) {

  }

  public unfollow(leader: string, follower: string) {
    
  }
  
}

export default FollowerDataSource;
