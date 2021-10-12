import * as Joi from 'joi';

export const updateUserSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email(),
});
