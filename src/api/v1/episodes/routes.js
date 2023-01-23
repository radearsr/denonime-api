const express = require("express");

const router = express();
const controller = require("./controller");

router
  .post("/", controller.postAddEpisodes)
  .get("/", controller.getAllEpisodes)
  .get("/:fullSlug", controller.getEpisodesByAnimeSlug)
  .get("/:animeId/animes", controller.getEpisodesByAnimeId)
  .get("/:episodeId/details", controller.getEpisodesById)
  .put("/:episodeId", controller.putEditEpisode)
  .delete("/:episodeId", controller.deleteEpisode);

module.exports = router;
