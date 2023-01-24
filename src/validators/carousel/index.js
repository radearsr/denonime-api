const InvariantError = require("../../exceptions/InvariantError");

const { CarouselPayloadSchema } = require("./schema");

const CarouselValidator = {
  validateCarouselPayload: (payload) => {
    const validationResult = CarouselPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CarouselValidator;
