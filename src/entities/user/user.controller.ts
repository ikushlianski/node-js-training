import { Request, Response } from 'express';
import url from 'url';
import querystring from 'querystring';

import { userService } from './user.service';
import { ErrorCodes } from '../../errors';

const DEFAULT_LIST_LENGTH = 10;

export async function getUserSuggestions(
  req: Request,
  res: Response,
): Promise<Response> {
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
    const autoSuggestList = await userService.suggest(
      username as string,
      parsedLimit,
    );

    return res.send(autoSuggestList);
  }

  return res.sendStatus(ErrorCodes.BadRequest);
}

export async function getUserById(
  req: Request,
  res: Response,
): Promise<Response> {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(ErrorCodes.BadRequest)
      .send('User id is not present in the request');
  }

  const user = await userService.getById(userId);

  if (!user) {
    return res.send([]);
  }

  return res.send(user);
}

export async function createUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const userData = req.body;

  try {
    const createdUser = await userService.create(userData);

    return res.status(201).send(createdUser);
  } catch (e) {
    return res.status(ErrorCodes.BadRequest).send(e.message);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const { userId } = req.params;
  const fieldsToUpdate = req.body;

  const updatedUser = await userService.update(fieldsToUpdate, userId);

  if (!updatedUser) {
    return res.status(404).send('User does not exist');
  }

  return res.send(updatedUser);
}

export async function softDeleteUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const { userId } = req.params;

  const deletedUser = await userService.softDelete(userId);

  if (!deletedUser) {
    return res.status(404).send('User does not exist');
  }

  return res.send(`Deleted user ${userId}`);
}
