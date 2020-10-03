import express from 'express';
import { groupController as groups } from './group.controller';
import {
  validateAddUserToGroup,
  validateCreateGroup,
  validateUpdateGroup,
} from './group.validation';

export const groupRouter = express.Router();

groupRouter
  .route('/groups')
  .get(groups.getGroups)
  .post([validateCreateGroup, groups.createGroup]);

groupRouter
  .route('/groups/:groupId')
  .get(groups.getGroupById)
  .patch([validateUpdateGroup, groups.updateGroup])
  .delete(groups.deleteOne);

groupRouter
  .route('/groups/add-users')
  .post([validateAddUserToGroup, groups.addUsersToGroup]);
