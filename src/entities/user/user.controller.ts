import { Request, Response } from 'express';
import url from 'url';
import querystring from 'querystring';

import { userService } from './user.service';
import { ErrorCodes } from '../../errors';
import { SuccessResponses } from '../../constants';
import { winstonLogger } from '../../utils/loggers';
import { LogLevels } from '../../utils';

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

  try {
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
  } catch (e) {
    winstonLogger(e.message, LogLevels.error);

    return res.status(ErrorCodes.InternalServerError).send(e.message);
  }
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

  try {
    const user = await userService.getById(userId);

    if (!user) {
      return res.send([]);
    }

    return res.send(user);
  } catch (e) {
    winstonLogger(e.message, LogLevels.error);

    return res.status(ErrorCodes.InternalServerError).send(e.message);
  }
}

export async function createUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const userData = req.body;

  try {
    const createdUser = await userService.create(userData);

    return res.status(SuccessResponses.Created).send(createdUser);
  } catch (e) {
    winstonLogger(e.message, LogLevels.error);

    return res.status(ErrorCodes.InternalServerError).send(e.message);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const { userId } = req.params;
  const fieldsToUpdate = req.body;

  try {
    const updatedUser = await userService.update(fieldsToUpdate, userId);

    if (!updatedUser) {
      return res.status(ErrorCodes.NotFound).send('User does not exist');
    }

    return res.send(updatedUser);
  } catch (e) {
    winstonLogger(e.message, LogLevels.error);

    return res.status(ErrorCodes.InternalServerError).send(e.message);
  }
}

export async function softDeleteUser(
  req: Request,
  res: Response,
): Promise<Response> {
  const { userId } = req.params;

  try {
    const deletedUser = await userService.softDelete(userId);

    if (!deletedUser) {
      return res.status(ErrorCodes.NotFound).send('User does not exist');
    }

    return res.send(`Deleted user ${userId}`);
  } catch (e) {
    winstonLogger(e.message, LogLevels.error);

    return res.status(ErrorCodes.InternalServerError).send(e.message);
  }
}
