import express from 'express';
import {
  addUsersToGroup,
  createGroup,
  deleteOne,
  getGroupById,
  getGroups,
  updateGroup,
} from './group.controller';
import {
  validateAddUserToGroup,
  validateCreateGroup,
  validateUpdateGroup,
} from './group.validation';

export const groupController = express.Router();

groupController
  .route('/groups')
  .get(getGroups)
  .post([validateCreateGroup, createGroup]);

groupController
  .route('/groups/:groupId')
  .get(getGroupById)
  .patch([validateUpdateGroup, updateGroup])
  .delete(deleteOne);

groupController
  .route('/groups/add-users')
  .post([validateAddUserToGroup, addUsersToGroup]);
