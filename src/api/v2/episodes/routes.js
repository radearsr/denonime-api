const { Router } = require("express");
const controllers = require("./controllers");

const router = Router();

router
  .post("/", controllers.postEpisodeController)
  .put("/:episodeId", controllers.putEpisodeController);

module.exports = router;