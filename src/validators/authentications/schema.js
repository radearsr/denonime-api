const Joi = require("joi");

const LoginPayloadSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(8).required(),
});

const TokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { LoginPayloadSchema, TokenPayloadSchema };
