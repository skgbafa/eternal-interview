import express from 'express';
import config from './config';
import MongoDBConnection from './connections/MongoDBConnection';
import initializeGraphQL from './graphql';

const { port } = config;

const app = express();
const mongoDBConnection = new MongoDBConnection(config);

const context = { config, mongoDBConnection };

initializeGraphQL(app, context).then(() => {
  app.get('/', (req, res) => {
    res.json({ message: 'Server Online' });
  });
    
  app.listen(port);
  console.log(`[${process.env.NODE_ENV}] Running on localhost:${port}`);
});


export default app;
