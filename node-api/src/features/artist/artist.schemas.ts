import * as Joi from 'joi';

export const followArtistSchema = Joi.object({
  artistId: Joi.number().required(),
});
