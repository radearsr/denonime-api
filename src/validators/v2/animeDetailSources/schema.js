const Joi = require("joi");

const createAnimeDetailSourcesPayloadSchema = Joi.object({
  anime_id: Joi.number().required(),
  url_source: Joi.string().required(),
  scraping_strategy: Joi.string().valid("ANIMEINDO", "OTAKUDESU", "CUSTOM"),
});

module.exports = {
  createAnimeDetailSourcesPayloadSchema,
};
