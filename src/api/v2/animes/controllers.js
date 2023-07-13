const ClientError = require("../../../exceptions/ClientError");
const services = require("../../../services/v2/animes/animeServices");
const validator = require("../../../validators/v2/animes");

exports.postAnimeController = async (req, res) => {
  try {
    validator.validateAnime(req.body);
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

exports.putAnimeController = async (req, res) => {
  try {
    const { animeId } = req.params;
    await services.verifyAnimeId(parseInt(animeId));
    validator.validateAnime(req.body);
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
    const deletedAnime = await services.deleteAllDataWithRelatedAnimeId(parseInt(animeId));
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

exports.postAnimeSourcesController = async (req, res) => {
  try {
    validator.validateAnimeDetailSources(req.body);
    await services.verifyAnimeId(req.body.anime_id);
    await services.createAnimeDetailSources(req.body);
    return res.send({
      status: "success",
      message: "Berhasil menambahkan sumber anime",
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

exports.getCountAnimesController = async (req, res) => {
  try {
    validator.validateGetAnimeCount(req.query);
    const animesCount = await services.readAnimesCount(req.query.scraping_strategy);
    return res.send({
      status: "success",
      animes_count: animesCount,
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

exports.getAllAnimesWithoutFilterController = async (req, res) => {
  try {
    const animes = await services.readAllAnimesWithoutFilter();
    return res.send({
      status: "success",
      message: "Berhasil mendapatkan semua anime",
      data: animes,
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
