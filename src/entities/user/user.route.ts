import express from 'express';

import { validateCreateUser, validateUpdateUser } from './user.validation';
import {
  createUser,
  getUserById,
  getUserSuggestions,
  softDeleteUser,
  updateUser,
} from './user.controller';

export const userController = express.Router();

userController.route('/users/suggest').get(getUserSuggestions);

userController.route('/users').post([validateCreateUser, createUser]);

userController
  .route('/users/:userId')
  .get(getUserById)
  .patch([validateUpdateUser, updateUser])
  .delete(softDeleteUser);
