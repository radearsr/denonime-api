const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  username: Joi.string().min(5).required(),
  password: Joi.string().min(8).required(),
});

module.exports = { UserPayloadSchema };
