const Joi = require("joi");

const EpisodePayloadSchema = Joi.object({
  animeId: Joi.string().required(),
  numEpisode: Joi.number().required(),
  source360p: Joi.string().required(),
  source480p: Joi.string().required(),
  source720p: Joi.string().required(),
  result360p: Joi.string().required(),
  result480p: Joi.string().required(),
  result720p: Joi.string().required(),
  published: Joi.boolean().required(),
});

module.exports = { EpisodePayloadSchema };
