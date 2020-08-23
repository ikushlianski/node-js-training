import express from 'express';
import url from 'url';
import querystring from 'querystring';
import { userService } from './user.service';
import { ErrorCodes } from '../errors/errors.enum';

export const userController = express.Router();

const DEFAULT_LIST_LENGTH = 10;

userController.route('/users/autosuggest').get((req, res) => {
  const { query } = url.parse(req.url);

  if (!query) return res.send(ErrorCodes.BadRequest);

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
});

// userController.get('/:userId', (req, res) => {
//   const user = userService.getById(req.params.userId);
//
//   if (!user) {
//     return res.send([]);
//   }
//
//   return res.send(user);
// });
