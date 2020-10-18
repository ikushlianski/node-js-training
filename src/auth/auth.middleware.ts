import { NextFunction, Request, Response } from 'express';
import { ErrorCodes, ErrorMessage } from '../errors';
import { TokenExpiredError, verify, VerifyErrors } from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if (!accessTokenSecret) {
  throw Error('Access token secret is not specified');
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(ErrorCodes.Unauthorized).send(ErrorMessage.Unauthorized);
  }

  return verify(accessToken, accessTokenSecret, (err, decoded) => {
    if (err) {
      return handleVerifyTokenError(err, res);
    }

    return next();
  });
};

const handleVerifyTokenError = (err: VerifyErrors, res: Response) => {
  if (err instanceof TokenExpiredError) {
    return res.status(ErrorCodes.Forbidden).send(ErrorMessage.TokenExpired);
  } else {
    return res.status(ErrorCodes.Forbidden).send(ErrorMessage.Forbidden);
  }
};
