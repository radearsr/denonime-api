const ClientError = require("../../../exceptions/ClientError");
const authenticationServices = require("../../../services/authentications/AuthenticationService");
const animeServices = require("../../../services/animes/AnimeServices");
const validators = require("../../../validators/episodes");
const services = require("../../../services/episodes/EpisodeServices");

exports.postAddEpisodes = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    await authenticationServices.verifyAuthorization(authHeader);
    const payload = req.body;
    validators.validateEpisodePayload(payload);
    const addedEpisode = await services.addNewEpisode(payload);
    return res.json({
      status: "success",
      message: "Berhasil menambahkan episode",
      data: {
        ...addedEpisode,
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

exports.putEditEpisode = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    await authenticationServices.verifyAuthorization(authHeader);
    const { episodeId } = req.params;
    await services.verifyEpisodeId(episodeId);
    const payload = req.body;
    validators.validateEpisodePayload(payload);
    const editedEpisode = await services.editEpisode(payload, episodeId);
    return res.json({
      status: "success",
      message: "Berhasil memperbarui episode",
      data: {
        animeId: editedEpisode.animeId,
        episodeId: editedEpisode.episodeId,
        numEpsisode: editedEpisode.numEpisode,
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

exports.deleteEpisode = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    await authenticationServices.verifyAuthorization(authHeader);
    const { episodeId } = req.params;
    await services.verifyEpisodeId(episodeId);
    await services.deleteEpisode(episodeId);
    return res.json({
      status: "success",
      message: "Berhasil menghapus episode",
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

exports.getEpisodesByAnimeSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { animeId } = await animeServices.readIdAnimeByAnimeSlug(slug);
    const episodes = await services.getEpisodesByAnimeId(animeId);
    return res.json({
      status: "success",
      message: "Episode ditemukan",
      data: {
        slug,
        animeId,
        episodes,
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
