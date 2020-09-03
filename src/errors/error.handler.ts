import { Request, Response, NextFunction } from 'express';
import { ErrorCodes } from './error.enum';

export const expressErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): Response => {
  return res.status(ErrorCodes.InternalServerError).send(err);
};
