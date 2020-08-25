import { Request, Response, NextFunction } from 'express';
import { ErrorCodes } from './errors.enum';

export const expressErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  console.log(err)
  return res
    .status(ErrorCodes.InternalServerError)
    .send(err);
};
