const InvariantError = require("../../exceptions/InvariantError");
const {
  AddAnimePayloadSchema,
} = require("./schema");

const AnimesValidator = {
  validateAnimePayload: (payload) => {
    const validationResult = AddAnimePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AnimesValidator;
