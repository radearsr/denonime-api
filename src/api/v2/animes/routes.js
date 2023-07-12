const { Router } = require("express");
const controllers = require("./controllers");

const router = Router();

router
  .post("/", controllers.postAnimeController)
  .put("/:animeId", controllers.putAnimeController)
  .delete("/:animeId", controllers.deleteAnimeController)
  .post("/sources", controllers.postAnimeSourcesController)
  .get("/count", controllers.GetCountAnimesController);

module.exports = router;
