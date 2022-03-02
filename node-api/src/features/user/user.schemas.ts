import * as Joi from 'joi';

export const getProfileDataSchema = Joi.object({
  username: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email(),
});
