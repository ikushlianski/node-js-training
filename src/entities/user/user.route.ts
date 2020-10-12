import express from 'express';

import { validateCreateUser, validateUpdateUser } from './user.validation';
import {
  createUser,
  getUserById,
  getUserSuggestions,
  softDeleteUser,
  updateUser,
} from './user.controller';

export const userRouter = express.Router();

userRouter.route('/users/suggest').get(getUserSuggestions);

userRouter.route('/users').post([validateCreateUser, createUser]);

userRouter
  .route('/users/:userId')
  .get(getUserById)
  .patch([validateUpdateUser, updateUser])
  .delete(softDeleteUser);
