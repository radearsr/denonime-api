const ClientError = require("../../../exceptions/ClientError");
const validator = require("../../../validators/users");
const services = require("../../../services/users/UserServices");

exports.postUserController = async (req, res) => {
  try {
    validator.validateUserPayload(req.body);

    await services.verifyNewUsername(req.body.username);
    const addedUser = await services.addUser(req.body);

    return res.status(201).send({
      status: "success",
      data: addedUser,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        status: "fail",
        message: error.message,
      });
    }
    return res.status(500).send({
      status: "error",
      message: "Terjadi kegagalan pada server kami.",
    });
  }
};
