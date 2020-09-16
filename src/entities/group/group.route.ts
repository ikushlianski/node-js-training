import express from 'express';
import { createGroup, getGroupById, getGroups } from './group.controller';
import { validateCreateGroup, validateUpdateGroup } from './group.validation';

export const groupController = express.Router();

groupController
  .route('/groups')
  .get(getGroups)
  .post([validateCreateGroup, createGroup]);

groupController
  .route('/groups/:groupId')
  .get(getGroupById)
  .patch([validateUpdateGroup])
  .delete();
