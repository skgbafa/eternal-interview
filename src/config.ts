import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  password:{
    hashRounds: 10,
    minLength: 8,
  },
  mongoDB: {
    username: process.env.MONGODB_USERNAME || '',
    password: process.env.MONGODB_PASSWORD || '',
    host: process.env.MONGODB_HOST || '',
    databaseName: process.env.DB_NAME || '',
    collectionNames: {
      users: 'users',
      followers: 'followers'
    }
  }
};

export default config;