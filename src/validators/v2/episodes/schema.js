const Joi = require("joi");

const createEpisodePayloadSchema = Joi.object({
  episode_slug: Joi.string().required(),
  episode_type: Joi.string().valid("TV", "MV", "OVA").required(),
  number_episode: Joi.number().required(),
  url_source: Joi.string().required(),
  published: Joi.boolean().required(),
  anime_id: Joi.number().required(),
});

module.exports = {
  createEpisodePayloadSchema,
};
