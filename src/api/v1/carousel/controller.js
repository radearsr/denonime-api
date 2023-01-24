const ClientError = require("../../../exceptions/ClientError");
const authenticationServices = require("../../../services/authentications/AuthenticationService");
const animeServices = require("../../../services/animes/AnimeServices");
const services = require("../../../services/carousel/CarouselServices");
const validator = require("../../../validators/carousel");

exports.postCarouselController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    await authenticationServices.verifyAuthorization(authHeader);
    const payload = req.body;
    validator.validateCarouselPayload(payload);
    await animeServices.verifyAnimeId(payload.animeId);
    const addedCarousel = await services.postAddCarousel(payload);
    return res.status(201).json({
      status: "success",
      message: "Berhasil menambakan carousel",
      data: {
        id: addedCarousel.id,
        title: addedCarousel.title,
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
