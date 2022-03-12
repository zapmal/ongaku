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

export const addAlbumToPlaylistSchema = Joi.object({
  playlistId: Joi.number().required(),
  albumId: Joi.number().required(),
});

export const addSongToPlaylistSchema = Joi.object({
  playlistId: Joi.number().required(),
  songId: Joi.number().required(),
});
