import * as Joi from 'joi';

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signupSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
});
