import { Request, Response } from 'express';
import { ErrorCodes } from '../errors';
import { UserModel } from '../db/models';
import { signTokens } from './auth.utils';

export const tokenController = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenFromUser } = req.body;

  if (!refreshTokenFromUser) {
    return res.sendStatus(ErrorCodes.Unauthorized);
  }

  const user = await UserModel.findOne({
    where: {
      refresh_token: refreshTokenFromUser,
    },
  });

  if (!user) {
    return res.sendStatus(ErrorCodes.Unauthorized);
  }

  const { refreshToken, accessToken } = signTokens({ username: user.login });

  await user.update({ refresh_token: refreshToken });

  return res.send({ refreshToken, accessToken });
};
