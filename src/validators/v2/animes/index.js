const InvariantError = require("../../../exceptions/InvariantError");
const {
  createAnimeSchema,
  createAnimeDetailSourcesSchema,
  readAnimeCountSchema,
} = require("./schema");

const AnimesValidator = {
  validateAnime: (payload) => {
    const validationResult = createAnimeSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateAnimeDetailSources: (payload) => {
    const validationResult = createAnimeDetailSourcesSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateGetAnimeCount: (payload) => {
    const validationResult = readAnimeCountSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AnimesValidator;
