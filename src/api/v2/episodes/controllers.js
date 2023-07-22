const services = require("../../../services/v2/episodes/episodeServices");
const animeServices = require("../../../services/v2/animes/animeServices");
const validator = require("../../../validators/v2/episodes");

exports.postEpisodeController = async (req, res, next) => {
  try {
    validator.validateEpisodePayload(req.body);
    await animeServices.verifyAnimeId(req.body.anime_id);
    const createdEpisode = await services.createEpisode(req.body);
    res.statusCode = 201;
    res.send({
      status: "success",
      message: "Berhasil menambahkan episode baru",
      data: {
        anime_id: createdEpisode.anime_id,
        episode_id: createdEpisode.id,
        episode_slug: createdEpisode.episode_slug,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.putEpisodeController = async (req, res, next) => {
  try {
    const { episodeId } = req.params;
    await services.verifyEpisodeId(parseInt(episodeId));
    await animeServices.verifyAnimeId(req.body.anime_id);
    validator.validateEpisodePayload(req.body);
    const updatedEpisode = await services.updateEpisode(parseInt(episodeId), req.body);
    res.send({
      status: "success",
      message: `Berhasil mengupdate episode dengan ID ${updatedEpisode.id}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEpisodeController = async (req, res, next) => {
  try {
    const { episodeId } = req.params;
    await services.verifyEpisodeId(parseInt(episodeId));
    const deletedEpisode = await services.deleteEpisode(parseInt(episodeId));
    res.send({
      status: "success",
      message: `Berhasil menghapus episode dengan ID ${deletedEpisode.id}`,
    });
  } catch (error) {
    next(error);
  }
};

exports.postEpisodeSourcesController = async (req, res, next) => {
  try {
    validator.validateEpisodeSourcePayload(req.body);
    await animeServices.verifyAnimeId(req.body.anime_id);
    await services.verifyEpisodeId(req.body.episode_id);
    await services.createEpisodeSources(req.body);
    res.statusCode = 201;
    res.send({
      status: "success",
      message: "Berhasil menambahkan sumber episode",
    });
  } catch (error) {
    next(error);
  }
};

exports.getEpisodeByAnimeIdController = async (req, res, next) => {
  try {
    const { animeId } = req.params;
    const episodes = await services.readEpisodesByAnimeId(parseInt(animeId));
    res.send({
      status: "success",
      message: `Berhasil mendapatkan episode dengan ID anime ${animeId}`,
      data: episodes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getEpisodeSourceByEpisodeIdController = async (req, res, next) => {
  try {
    const { episodeId } = req.params;
    const sources = await services.readSourceByEpisodeId(parseInt(episodeId));
    res.send({
      status: "success",
      message: `Berhasil mendapatkan sumber episode dengan ID ${episodeId}`,
      data: sources,
    });
  } catch (error) {
    next(error);
  }
};
