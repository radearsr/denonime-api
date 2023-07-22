const { Router } = require("express");
const controllers = require("./controllers");

const router = Router();

router
  .post("/", controllers.postEpisodeController)
  .put("/:episodeId", controllers.putEpisodeController)
  .delete("/:episodeId", controllers.deleteEpisodeController)
  .post("/sources", controllers.postEpisodeSourcesController)
  .get("/anime/:animeId", controllers.getEpisodeByAnimeIdController)
  .get("/sources/details/:episodeId", controllers.getEpisodeSourceByEpisodeIdController);

module.exports = router;
