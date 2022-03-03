import * as Joi from 'joi';

export const getProfileDataSchema = Joi.object({
  username: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  id: Joi.number().required(),
  fullName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  avatar: Joi.any(),
});
