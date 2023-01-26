const ClientError = require("../../../exceptions/ClientError");
const authenticationServices = require("../../../services/authentications/AuthenticationService");
const animeServices = require("../../../services/animes/AnimeServices");
const validators = require("../../../validators/episodes");
const services = require("../../../services/episodes/EpisodeServices");

exports.postAddEpisodesController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    await authenticationServices.verifyAuthorization(authHeader);
    const payload = req.body;
    validators.validateEpisodePayload(payload);
    const addedEpisode = await services.addNewEpisode(payload);
    return res.status(201).json({
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

exports.putEditEpisodeController = async (req, res) => {
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

exports.deleteEpisodeController = async (req, res) => {
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

exports.getEpisodesByAnimeSlugController = async (req, res) => {
  try {
    const { fullSlug } = req.params;
    const [slug, episode] = fullSlug.split("-episode-");
    const animeWithEpisode = await animeServices
      .readAnimeWithDetailsEpisode(slug, parseFloat(episode));
    return res.json({
      status: "success",
      message: "Anime dengan detail dan episode ditemukan",
      data: {
        ...animeWithEpisode,
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

exports.getEpisodesByAnimeIdController = async (req, res) => {
  try {
    const { animeId } = req.params;
    const episodes = await services.readAllEpisodesByAnimeId(parseFloat(animeId));
    return res.json({
      status: "success",
      message: `Episode dengan ID Anime ${animeId} ditemukan`,
      data: {
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

exports.getEpisodesByIdController = async (req, res) => {
  try {
    const { episodeId } = req.params;
    await services.verifyEpisodeId(episodeId);
    const episode = await services.readEpisodeByEpisodeId(episodeId);
    return res.json({
      status: "success",
      message: "Episode ditemukan",
      data: {
        ...episode,
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

exports.getAllEpisodesController = async (req, res) => {
  try {
    const episodes = await services.readAllEpisodes();
    return res.json({
      status: "success",
      message: "Semua episode ditemukan",
      data: {
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
