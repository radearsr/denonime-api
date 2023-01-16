const Joi = require("joi");

const AddAnimePayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  poster: Joi.string().required(),
  type: Joi.string().valid("Movie", "Series").required(),
  releaseDate: Joi.string().required(),
  genre: Joi.string().required(),
  status: Joi.string().valid("Completed", "Ongoing").required(),
});

module.exports = {
  AddAnimePayloadSchema,
};
