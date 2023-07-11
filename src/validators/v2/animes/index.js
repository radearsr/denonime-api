const InvariantError = require("../../../exceptions/InvariantError");
const { createAnimePayloadSchema } = require("./schema");

const AnimesValidator = {
  validateAnimePayload: (payload) => {
    const validationResult = createAnimePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AnimesValidator;