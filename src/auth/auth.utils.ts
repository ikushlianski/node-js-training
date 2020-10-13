import jwt, { Secret } from 'jsonwebtoken';
import { TokenPayload, Tokens } from './auth.interface';

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw Error('Access token secret not set up');
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw Error('Refresh token secret not set up');
}

export const signTokens = (payload: TokenPayload): Tokens => {
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      algorithm: 'HS256',
      expiresIn: Number(process.env.ACCESS_TOKEN_LIFE),
    },
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      algorithm: 'HS256',
      expiresIn: Number(process.env.REFRESH_TOKEN_LIFE),
    },
  );

  return { accessToken, refreshToken };
};
