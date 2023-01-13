const InvariantError = require("../../exceptions/InvariantError");
const { LoginPayloadSchema } = require("./schema");

const AuthenticationValidator = {
  validateLoginPayload: (payload) => {
    console.log(payload.password);
    const validationResult = LoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
