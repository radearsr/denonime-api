const Joi = require("joi");

const EpisodePayloadSchema = Joi.object({
  animeId: Joi.number().required(),
  episodeType: Joi.string().valid("Tv", "Ova").required(),
  streamStrategy: Joi.string().valid("Otakudesu", "OwnServer", "Mp4").required(),
  numEpisode: Joi.number().required(),
  sourceDefault: Joi.string().required(),
  sourceHd: Joi.string().required(),
  originalSourceEp: Joi.string().required(),
  publish: Joi.boolean().required(),
});

module.exports = { EpisodePayloadSchema };
