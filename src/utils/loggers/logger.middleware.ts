import { NextFunction, Request, Response } from 'express';
import { winstonLogger } from './winston.logger';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const message = `
    URL: ${req.url}
    METHOD: ${req.method}
  `;
  winstonLogger(message);

  next();
};
