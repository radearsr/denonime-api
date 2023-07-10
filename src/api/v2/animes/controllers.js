const ClientError = require("../../../exceptions/ClientError");
const prismaServices = require("../../../services/v2/animes/animeServices");
const payloadValidator = require("../../../validators/v2/animes");

exports.postAnimeController = async (req, res) => {
  try {
    payloadValidator.validateAnimePayload(req.body);
    const createdAnime = await prismaServices.createAnime(req.body);
    await prismaServices.createAnimeGenres(
      req.body.genres,
      createdAnime.id,
    );
    res.statusCode = 201;
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

exports.putAnimeController = async (req, res) => {
  try {
    const { animeId } = req.params;
    await prismaServices.verifyAnimeId(parseInt(animeId));
    payloadValidator.validateAnimePayload(req.body);
    const updatedAnime = await prismaServices.updateAnimeById(parseInt(animeId), req.body);
    return res.send({
      status: "success",
      message: `Berhasil memperbarui anime ${updatedAnime.title}`,
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

exports.deleteAnimeController = async (req, res) => {
  try {
    const { animeId } = req.params;
    await prismaServices.verifyAnimeId(parseInt(animeId));
    const deletedAnime = await prismaServices.deleteAnimeAndGenres(parseInt(animeId));
    return res.send({
      status: "success",
      message: `Berhasil menghapus anime ${deletedAnime.title}`,
    });
  } catch (error) {
    console.log(error);
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
