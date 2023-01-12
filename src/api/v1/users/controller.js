const ClientError = require("../../../exceptions/ClientError");
const validator = require("../../../validators/users");
const userService = require("../../../services/users/UserServices");

exports.postUserController = async (req, res) => {
  try {
    validator.validateUserPayload(req.body);
    await userService.verifyAvailableUsername(req.body.username);
    const addedUser = await userService.addUser(req.body);
    res.status(201).send({
      status: "success",
      data: addedUser,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.status(error.statusCode).send({
        status: "fail",
        message: error.message,
      });
    }
  }
};
