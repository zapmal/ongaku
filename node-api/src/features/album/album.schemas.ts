import * as Joi from 'joi';

export const likeAlbumSchema = Joi.object({
  albumId: Joi.number().required(),
});
