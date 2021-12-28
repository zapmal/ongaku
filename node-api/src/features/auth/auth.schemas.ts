import * as Joi from 'joi';

/**
 * TODO: Set .max() and .min()
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  isArtist: Joi.boolean().required(),
});

export const userRegisterSchema = Joi.object({
  fullName: Joi.string().required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  birthdate: Joi.date().required(),
  role: Joi.string().valid('USER').required(),
});

export const artistRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  country: Joi.string().max(2).min(2).required(),
  genres: Joi.array().min(1).required(),
  labels: Joi.array().required(),
  yearsActive: Joi.number().positive().integer().required(),
  isBand: Joi.boolean().required(),
  role: Joi.string().valid('ARTIST').required(),
  artisticName: Joi.string().when('isBand', {
    is: false,
    then: Joi.string().required(),
  }),
  bandName: Joi.string().when('isBand', {
    is: true,
    then: Joi.string().required(),
  }),
  members: Joi.array().when('isBand', {
    is: true,
    then: Joi.array().required(),
  }),
});
