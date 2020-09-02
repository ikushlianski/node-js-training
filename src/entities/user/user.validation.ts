import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ErrorCodes } from '../../errors';

const LOGIN_RULES = Joi.string().max(30);

// at least 1 letter and at least 1 digit
const PASSWORD_REGEXP = new RegExp('^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$');

const PASSWORD_RULES = Joi.string()
  .pattern(PASSWORD_REGEXP)
  .error(new Error('Password has incorrect format'));

const AGE_RULES = Joi.number().min(4).max(130);
const IS_DELETED_RULES = Joi.bool();

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const schema = Joi.object({
    login: LOGIN_RULES.required(),
    password: PASSWORD_RULES.required(),
    age: AGE_RULES.required(),
  }).allow('login', 'password', 'age');

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(ErrorCodes.BadRequest).send(error.message);
  }

  return next();
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  if (req.body.id) {
    return res.status(ErrorCodes.BadRequest).send('User id cannot be changed');
  }

  const schema = Joi.object({
    login: LOGIN_RULES,
    password: PASSWORD_RULES,
    age: AGE_RULES,
    isDeleted: IS_DELETED_RULES,
  }).allow('login', 'password', 'age', 'isDeleted');

  const validation = schema.validate(req.body);

  if (validation.error) {
    return res.status(ErrorCodes.BadRequest).send(validation.error.message);
  }

  return next();
};
