const ClientError = require("../../../exceptions/ClientError");
const services = require("../../../services/v2/animes/animeServices");
const validator = require("../../../validators/v2/animes");

exports.postAnimeController = async (req, res) => {
  try {
    validator.validateAnimePayload(req.body);
    const createdAnime = await services.createAnime(req.body);
    await services.createAnimeGenres(
      req.body.genres,
      createdAnime.id,
    );
    res.statusCode = 201;
    return res.send({
      status: "success",
      message: "Berhasil menambahkan anime baru",
      data: {
        id: createdAnime.id,
        title: createdAnime.title,
        anime_slug: createdAnime.anime_slug,
      },
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
    await services.verifyAnimeId(parseInt(animeId));
    validator.validateAnimePayload(req.body);
    const updatedAnime = await services.updateAnimeById(parseInt(animeId), req.body);
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
    await services.verifyAnimeId(parseInt(animeId));
    const deletedAnime = await services.deleteAnimeAndGenres(parseInt(animeId));
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
