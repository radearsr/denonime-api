const Joi = require("joi");

const createAnimePayloadSchema = Joi.object({
  title: Joi.string().required(),
  rating: Joi.number().required(),
  synopsis: Joi.string().required(),
  poster: Joi.string().required(),
  anime_type: Joi.string().valid("MOVIES", "SERIES").required(),
  release_date: Joi.string().required(),
  genres: Joi.string().required(),
  status: Joi.string().valid("COMPLETED", "ONGOING").required(),
  published: Joi.boolean().required(),
});

module.exports = {
  createAnimePayloadSchema,
};
