const ClientError = require("../../../exceptions/ClientError");
const services = require("../../../services/v2/episodes/episodeServices");
const animeServices = require("../../../services/v2/animes/animeServices");
const validator = require("../../../validators/v2/episodes");

exports.postEpisodeController = async (req, res) => {
  try {
    validator.validateEpisodePayload(req.body);
    await animeServices.verifyAnimeId(req.body.anime_id);
    const createdEpisode = await services.createEpisode(req.body);
    res.statusCode = 201;
    return res.send({
      status: "success",
      message: "Berhasil menambahkan episode baru",
      data: {
        anime_id: createdEpisode.anime_id,
        episode_slug: createdEpisode.episode_slug,
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

exports.putEpisodeController = async (req, res) => {
  try {
    const { episodeId } = req.params;
    await services.verifyEpisodeId(parseInt(episodeId));
    await animeServices.verifyAnimeId(req.body.anime_id);
    validator.validateEpisodePayload(req.body);
    const updatedEpisode = await services.updateEpisode(parseInt(episodeId), req.body);
    return res.send({
      status: "success",
      message: `Berhasil mengupdate episode dengan ID ${updatedEpisode.id}`,
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

exports.deleteEpisodeController = async (req, res) => {
  try {
    const { episodeId } = req.params;
    await services.verifyEpisodeId(parseInt(episodeId));
    const deletedEpisode = await services.deleteEpisode(parseInt(episodeId));
    return res.send({
      status: "success",
      message: `Berhasil menghapus episode dengan ID ${deletedEpisode.id}`,
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

exports.postEpisodeSourcesController = async (req, res) => {
  try {
    validator.validateEpisodeSourcePayload(req.body);
    await animeServices.verifyAnimeId(req.body.anime_id);
    await services.verifyEpisodeId(req.body.episode_id);
    await services.createEpisodeSources(req.body);
    return res.send({
      status: "success",
      message: "Berhasil menambahkan sumber episode",
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
