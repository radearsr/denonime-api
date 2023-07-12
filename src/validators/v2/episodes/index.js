const InvariantError = require("../../../exceptions/InvariantError");
const {
  createEpisodePayloadSchema,
  createEpisodeSourcePayloadSchema,
} = require("./schema");

const EpisodeValidator = {
  validateEpisodePayload: (payload) => {
    const validationResult = createEpisodePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateEpisodeSourcePayload: (payload) => {
    const validationResult = createEpisodeSourcePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = EpisodeValidator;
