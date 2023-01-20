const InvariantError = require("../../exceptions/InvariantError");

const { EpisodePayloadSchema } = require("./schema");

const EpisodeValidator = {
  validateEpisodePayload: (payload) => {
    const validationResult = EpisodePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = EpisodeValidator;
