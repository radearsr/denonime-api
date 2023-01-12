const ClientError = require("../../../exceptions/ClientError");
const validator = require("../../../validators/users");

exports.postUserController = async (req, res) => {
  try {
    console.log(req.body);
    const payload = req.body;
    validator.validateUserPayload(req.body);
    res.status(201).send({
      status: "success",
      data: payload,
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
