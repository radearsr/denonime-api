const InvariantError = require("../../exceptions/InvariantError");
const { LoginPayloadSchema, TokenPayloadSchema } = require("./schema");

const AuthenticationValidator = {
  validateLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateTokenPayload: (payload) => {
    const validationResult = TokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
