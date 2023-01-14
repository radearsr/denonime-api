const ClientError = require("../../../exceptions/ClientError");
const validator = require("../../../validators/authentications");
const UserServices = require("../../../services/users/UserServices");
const AutenticationService = require("../../../services/authentications/AuthenticationService");
const tokens = require("../../../tokens/TokenManager");

exports.postUserAuthentication = async (req, res) => {
  try {
    validator.validateLoginPayload(req.body);

    const { username, password } = req.body;
    const { userId, roleId } = await UserServices.verifyUserCredential(username, password);

    const accessToken = tokens.generateAccessToken({ userId, roleId });
    const refreshToken = tokens.generateRefreshToken({ userId, roleId });

    await AutenticationService.addRefreshToken(refreshToken);

    return res.json({
      status: "success",
      message: "Berhasil menambahkan authentication",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
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
