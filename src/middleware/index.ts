import compression from 'compression';
import helmet from 'helmet';

import authentication from './authentication';

const initializeMiddleware = (app: any, context: any) => {
  // setup boilderplate middleware
  app.use(compression());
  // app.use(helmet());

  // handle authentication
  app.use(authentication(context));
};

export default initializeMiddleware;
