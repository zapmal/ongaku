import * as Joi from 'joi';

export const likeSongSchema = Joi.object({
  songId: Joi.number().required(),
});
