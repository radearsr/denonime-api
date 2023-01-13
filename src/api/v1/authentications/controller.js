const ClientError = require("../../../exceptions/ClientError");
const validator = require("../../../validators/authentications");
const services = require("../../../services/authentications/AuthenticationService");

exports.postUserAuthentication = async (req, res) => {
  try {
    validator.validateLoginPayload(req.body);
    const { username, password } = req.body;
    await services.verifyUserCredential(username, password);
    return res.json({
      status: "success",
      data: req.body,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json({
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
