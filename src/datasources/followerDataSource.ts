/* eslint-disable @typescript-eslint/no-empty-function */
import { DataSource } from 'apollo-datasource';

class followerDataSource extends DataSource {

  constructor() {
    super();
  }

  public follow(leader: string, follower: string) {

  }

  public unfollow(leader: string, follower: string) {
    
  }
  
}

export default followerDataSource;
