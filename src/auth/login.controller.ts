import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../db/models';
import { ErrorCodes } from '../errors';
import { signTokens } from './auth.utils';

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({
    where: {
      login: username,
    },
  });

  if (!user) {
    return res.sendStatus(ErrorCodes.Unauthorized);
  }

  if (user.password) {
    const hashedPassword = user.password;

    const matches = await bcrypt.compare(password, hashedPassword);

    if (!matches) {
      return res.sendStatus(ErrorCodes.Unauthorized);
    }
  }

  const payload = { username };
  const { accessToken, refreshToken } = signTokens(payload);

  await user.update({ refresh_token: refreshToken });

  return res.send({ accessToken, refreshToken });
};
