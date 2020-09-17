import express from 'express';
import {
  createGroup,
  deleteOne,
  getGroupById,
  getGroups,
  updateGroup,
} from './group.controller';
import { validateCreateGroup, validateUpdateGroup } from './group.validation';

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
