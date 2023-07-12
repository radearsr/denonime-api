const InvariantError = require("../../../exceptions/InvariantError");
const { createAnimePayloadSchema } = require("./schema");

const AnimeDetailSourcesValidator = {
  validateAnimeDetailSourcesPayload: (payload) => {
    const validationResult = createAnimePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AnimeDetailSourcesValidator;
