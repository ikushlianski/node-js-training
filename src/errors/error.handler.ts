import { Request, Response, NextFunction } from 'express';
import { ErrorCodes } from './errors.enum';

export const expressErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  return res
    .status(ErrorCodes.InternalServerError)
    .send('Internal server error');
};
