import * as Joi from 'joi';

export const createNewRoomSchema = Joi.object({
  name: Joi.string().required(),
  limit: Joi.number().min(1).max(5).required(),
  genres: Joi.array().required(),
  queue: Joi.array().required(),
});
