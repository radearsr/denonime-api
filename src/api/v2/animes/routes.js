const { Router } = require("express");
const controllers = require("./controllers");

const router = Router();

router
  .post("/", controllers.postAnimeController)
  .put("/:animeId", controllers.putAnimeController)
  .delete("/:animeId", controllers.deleteAnimeController)
  .post("/sources", controllers.postAnimeSourcesController)
  .get("/count", controllers.getCountAnimesController)
  .get("/all", controllers.getAllAnimesWithoutFilterController)
  .get("/ongoing", controllers.getAllAnimesOngoing)
  .get("/sorting", controllers.getAnimesWithSortingController)
  .get("/genres", controllers.getAnimeGenresController)
  .get("/details/:animeSlug", controllers.getAnimeBySlugController)
  .get("/search", controllers.getAnimeBySearchController)
  .get("/:animeId", controllers.getAnimeByIdController);

module.exports = router;
