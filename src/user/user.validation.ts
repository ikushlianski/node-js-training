import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ErrorCodes } from '../errors/errors.enum';

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    login: Joi.string().required().max(30),
    password: Joi.string().required()
      .pattern(
        // at least 1 letter and at least 1 digit
        new RegExp('^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$'),
      )
      .error(new Error('Password has incorrect format')),
    age: Joi.number().required().min(4).max(130),
    isDeleted: Joi.bool(),
  });

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
) => {
  if (req.body.id) {
    return res.status(ErrorCodes.BadRequest).send('User id cannot be changed');
  }

  const schema = Joi.object({
    login: Joi.string().max(30),
    password: Joi.string()
      .pattern(
        // at least 1 letter and at least 1 digit
        new RegExp('^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$'),
      )
      .error(new Error('Password has incorrect format')),
    age: Joi.number().min(4).max(130),
    isDeleted: Joi.bool(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    return res.status(ErrorCodes.BadRequest).send(validation.error.message);
  }

  return next();
};
