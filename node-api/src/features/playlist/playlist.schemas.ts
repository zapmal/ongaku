import * as Joi from 'joi';

export const newPlaylistSchema = Joi.object({
  name: Joi.string(),
  background: Joi.array(),
  cover: Joi.array(),
});

export const getMyPlaylistsSchema = Joi.object({
  entityId: Joi.number().required(),
});
