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

    return res.status(201).send({
      status: "success",
      message: "Berhasil menambahkan authentication",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        status: "fail",
        message: error.message,
      });
    }
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Terjadi kegagalan pada server kami.",
    });
  }
};

exports.putAccessToken = async (req, res) => {
  try {
    validator.validateTokenPayload(req.body);

    const { refreshToken } = req.body;

    await AutenticationService.verifyRefreshToken(refreshToken);
    const { userId, roleId } = tokens.verifyRefreshToken(refreshToken);

    const accessToken = tokens.generateAccessToken({ userId, roleId });
    return res.send({
      status: "success",
      message: "Berhasil memperbarui token",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        status: "fail",
        message: error.message,
      });
    }
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Terjadi kegagalan pada server kami.",
    });
  }
};

exports.deleteRefreshToken = async (req, res) => {
  try {
    validator.validateTokenPayload(req.body);
    const { refreshToken } = req.body;

    await AutenticationService.verifyRefreshToken(refreshToken);
    await AutenticationService.deleteRefreshToken(refreshToken);

    return res.send({
      status: "success",
      message: "Berhasil menghapus token",
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).send({
        status: "fail",
        message: error.message,
      });
    }
    console.error(error);
    return res.status(500).send({
      status: "error",
      message: "Terjadi kegagalan pada server kami.",
    });
  }
};
