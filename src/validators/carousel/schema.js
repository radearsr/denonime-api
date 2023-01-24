const Joi = require("joi");

const CarouselPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("Series", "Movie").required(),
  poster: Joi.string().required(),
  background: Joi.string().required(),
  episodes: Joi.number().required(),
  releaseDate: Joi.string().required(),
  animeId: Joi.number().required(),
});

module.exports = { CarouselPayloadSchema };
