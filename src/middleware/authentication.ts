import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface UserProps {
  iat?: number;
  _id?: string;
  userId?: string;
}

export interface User {
  user: UserProps;
}

// eslint-disable-next-line arrow-body-style
const authenticationMiddleware = ({ config }: any) => {
  return async (req: Request & User, res: Response, next: NextFunction) => {
    const { authorization }: any = req.headers;
    if (authorization) {
      try {
        const auth = authorization.split(' ');
        if (auth[0] === 'Bearer') {
          const token = auth[1];
          if (token) {
            // get jwt payload
            const payload: any = jwt.verify(token, config.jwt.secret);
            // add payload to user
            req.user = payload;
          }
        }
      } catch (error) {
        // capture error in logger or send to error handler
        // but continue with request since this is auth middleware
        console.error(error);
      }
    }
    next();
  };
};

export default authenticationMiddleware;
