const Joi = require("joi");

const createAnimeSchema = Joi.object({
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

const createAnimeDetailSourcesSchema = Joi.object({
  anime_id: Joi.number().required(),
  url_source: Joi.string().required(),
  scraping_strategy: Joi.string().valid("ANIMEINDO", "OTAKUDESU", "CUSTOM"),
});

module.exports = {
  createAnimeSchema,
  createAnimeDetailSourcesSchema,
};
