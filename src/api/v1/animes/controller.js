const ClientError = require("../../../exceptions/ClientError");
const authenticationServices = require("../../../services/authentications/AuthenticationService");
const services = require("../../../services/animes/AnimeServices");
const validator = require("../../../validators/animes");

exports.postAnimeController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    await authenticationServices.verifyAuthorization(authHeader);
    validator.validateAnimePayload(req.body);
    const addedAnime = await services.addNewAnime(req.body);
    await services.addAnimeGenres(req.body.genre, addedAnime.animeId);
    return res.send({
      status: "sucess",
      data: {
        animeId: addedAnime.animeId,
        slug: addedAnime.slug,
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

exports.putAnimeController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    await authenticationServices.verifyAuthorization(authHeader);
    const { animeId } = req.params;
    await services.verifyAnimeId(animeId);
    validator.validateAnimePayload(req.body);
    const updatedAnime = await services.updateAnime(req.body, animeId);
    await services.updateAnimeGenres(req.body.genre, animeId);
    return res.json({
      status: "success",
      message: "Berhasil memperbarui data anime",
      data: {
        animeId: updatedAnime.animeId,
        slug: updatedAnime.slug,
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
