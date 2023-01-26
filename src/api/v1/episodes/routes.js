const express = require("express");

const router = express();
const controller = require("./controller");

router
  .post("/", controller.postAddEpisodesController)
  .get("/", controller.getAllEpisodesController)
  .get("/:fullSlug", controller.getEpisodesByAnimeSlugController)
  .get("/:animeId/animes", controller.getEpisodesByAnimeIdController)
  .get("/:episodeId/details", controller.getEpisodesByIdController)
  .put("/:episodeId", controller.putEditEpisodeController)
  .delete("/:episodeId", controller.deleteEpisodeController);

module.exports = router;
