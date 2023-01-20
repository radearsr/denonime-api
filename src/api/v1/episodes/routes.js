const express = require("express");

const router = express();
const controller = require("./controller");

router
  .post("/", controller.postAddEpisodes)
  .put("/:episodeId", controller.putEditEpisode)
  .delete("/:episodeId", controller.deleteEpisode);

module.exports = router;
