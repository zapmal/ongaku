import * as Joi from 'joi';

export const newPlaylistSchema = Joi.object({
  name: Joi.string(),
  background: Joi.any(),
  cover: Joi.any(),
});

export const likePlaylistSchema = Joi.object({
  playlistId: Joi.number().required(),
});

export const getLikedPlaylistsSchema = Joi.object({
  entityId: Joi.number().required(),
});
