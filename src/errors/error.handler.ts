import { NextFunction, Request, Response } from 'express';
import { ErrorCodes } from './error.enum';
import { winstonLogger } from '../utils/loggers';
import { LogLevels } from '../utils';

export const expressErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): Response => {
  winstonLogger(
    `Unhandled error (${err.name}): ${err.message}`,
    LogLevels.error,
  );

  return res.status(ErrorCodes.InternalServerError).send(err);
};
