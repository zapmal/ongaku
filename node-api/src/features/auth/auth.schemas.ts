import * as Joi from 'joi';

/**
 * TODO: Set .max() and .min()
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const userRegisterSchema = Joi.object({
  fullName: Joi.string().required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  birthdate: Joi.date().required(),
  role: Joi.string(),
});
