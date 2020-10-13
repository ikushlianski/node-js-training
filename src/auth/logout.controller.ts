import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserModel } from '../db/models';
import { ErrorCodes, ErrorMessage } from '../errors';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if (!accessTokenSecret) {
  throw Error('Access token secret is not specified');
}

export const logoutController = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const { username } = req.body;

  if (!accessToken || !username) {
    return res.status(ErrorCodes.Unauthorized).send(ErrorMessage.Unauthorized);
  }

  const user = await UserModel.findOne({
    where: {
      login: username,
    },
  });

  if (!user) {
    return res.sendStatus(ErrorCodes.Unauthorized);
  }

  try {
    await jwt.verify(accessToken, accessTokenSecret);
    await user.update({ refresh_token: null });

    return res.send();
  } catch (e) {
    return res.status(ErrorCodes.Unauthorized).send(ErrorMessage.Unauthorized);
  }
};
