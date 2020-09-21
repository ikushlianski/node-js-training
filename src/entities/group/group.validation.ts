import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ErrorCodes } from '../../errors';
import { groupPermissionsList } from '../../constants/permissions.constant';

const NAME_RULES = Joi.string().min(1).max(255);
const PERMISSION_RULES = Joi.array().items(...groupPermissionsList);

export const validateCreateGroup = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const schema = Joi.object({
    name: NAME_RULES.required(),
    permissions: PERMISSION_RULES,
  }).allow('name', 'permissions');

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(ErrorCodes.BadRequest).send(error.message);
  }

  return next();
};

export const validateUpdateGroup = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const schema = Joi.object({
    name: NAME_RULES,
    permissions: PERMISSION_RULES,
  }).allow('name', 'permissions');

  const validation = schema.validate(req.body);

  if (validation.error) {
    return res.status(ErrorCodes.BadRequest).send(validation.error.message);
  }

  return next();
};

export const validateAddUserToGroup = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const schema = Joi.object({
    groupId: Joi.string().uuid(),
    userIds: Joi.array().items(Joi.string().uuid()),
  }).allow('groupId', 'userIds');

  const validation = schema.validate(req.body);

  if (validation.error) {
    return res.status(ErrorCodes.BadRequest).send(validation.error.message);
  }

  return next();
};
