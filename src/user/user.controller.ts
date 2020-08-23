import express, { Request, Response } from 'express';
import url from 'url';
import querystring from 'querystring';

import { userService } from './user.service';
import { ErrorCodes } from '../errors/errors.enum';
import { UserDto, UserInterface } from './user.interface';

export const userController = express.Router();

const DEFAULT_LIST_LENGTH = 10;

userController.route('/users').get(getUserSuggestions).post(createUser);

userController.route('/users/:userId').get(getUserById).put(updateUser);

function getUserSuggestions(req: Request, res: Response) {
  const { query } = url.parse(req.url);

  if (!query) {
    return res.status(ErrorCodes.BadRequest).send('Query params not provided');
  }

  const { limit, username } = querystring.parse(query);

  if (username) {
    const parsedLimit = isNaN(Number(limit))
      ? DEFAULT_LIST_LENGTH
      : Number(limit);

    // we assume only one user can be checked at a time
    const autoSuggestList = userService.suggest(
      username as string,
      parsedLimit,
    );

    return res.send(autoSuggestList);
  }

  return res.send(ErrorCodes.BadRequest);
}

function getUserById(req: Request, res: Response) {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(ErrorCodes.BadRequest)
      .send('User id is not present in the request');
  }

  const user = userService.getById(userId);

  if (!user) {
    return res.send([]);
  }

  return res.send(user);
}

function createUser(req: Request, res: Response) {
  const userData = req.body;

  try {
    const createdUser = userService.create(userData);

    return res.status(201).send(createdUser);
  } catch (e) {
    return res.status(ErrorCodes.BadRequest).send(e.message);
  }
}

function updateUser(req: Request, res: Response) {

}
