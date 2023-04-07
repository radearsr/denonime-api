const Joi = require("joi");

const AddAnimePayloadSchema = Joi.object({
  title: Joi.string().required(),
  rating: Joi.number().required(),
  description: Joi.string().required(),
  poster: Joi.string().required(),
  type: Joi.string().valid("Movie", "Series").required(),
  originalSource: Joi.string().required(),
  releaseDate: Joi.string().required(),
  genre: Joi.string().required(),
  status: Joi.string().valid("Completed", "Ongoing").required(),
  publish: Joi.boolean().required(),
});

module.exports = {
  AddAnimePayloadSchema,
};
