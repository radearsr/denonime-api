const Joi = require("joi");

const EpisodePayloadSchema = Joi.object({
  animeId: Joi.string().required(),
  numEpisode: Joi.string().required(),
  source360p: Joi.string().required(),
  source480p: Joi.string().required(),
  source720p: Joi.string().required(),
  publishStatus: Joi.string().required(),
});

module.exports = { EpisodePayloadSchema };
