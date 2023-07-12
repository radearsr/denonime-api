const InvariantError = require("../../../exceptions/InvariantError");
const { createEpisodePayloadSchema } = require("./schema");

const EpisodeValidator = {
  validateEpisodePayload: (payload) => {
    const validationResult = createEpisodePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = EpisodeValidator;
