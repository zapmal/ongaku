import * as Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
});
