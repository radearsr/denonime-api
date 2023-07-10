const ClientError = require("../../../exceptions/ClientError");
const prismaServices = require("../../../services/v2/animes/animeServices");
const payloadValidator = require("../../../validators/v2/animes");

exports.postAnimesController = async (req, res) => {
  try {
    console.log(req.body);
    payloadValidator.validateAnimePayload(req.body);
    const createdAnime = await prismaServices.createAnime(req.body);
    return res.send({
      status: "success",
      message: "Berhasil menambahkan anime baru",
      data: createdAnime,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      res.statusCode = error.statusCode;
      return res.send({
        status: "fail",
        message: error.message,
      });
    }
    res.statusCode = 500;
    return res.send({
      status: "error",
      message: "Terjadi kegagalan pada server kami.",
    });
  }
};
