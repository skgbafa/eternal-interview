import express from 'express';
import config from './config';

import initializeGraphQL from './graphql';
import MongoDBConnection from './connections/mongoDBConnection';
import initializeMiddleware from './middleware';

const { port } = config;

const app = express();
const mongoDBConnection = new MongoDBConnection(config);

const context = { config, mongoDBConnection };

initializeMiddleware(app, context);

initializeGraphQL(app, context).then(() => {
  app.get('/', (req, res) => {
    res.json({ message: 'Server Online! Check out /graphql' });
  });

  app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`[${process.env.NODE_ENV}] Running on localhost:${port}`);
});

export default app;
