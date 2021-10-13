import * as Joi from 'joi';

/**
 * TODO: Set .max() and .min()
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
  avatar: Joi.string(),
  birthdate: Joi.date().required(),
  role: Joi.string(),
});
