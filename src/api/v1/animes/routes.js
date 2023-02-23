const express = require("express");
const controller = require("./controller");

const router = express();

router
  .post("/", controller.postAnimeController)
  .get("/", controller.getAnimesByTypeWithPaginController)
  .get("/list", controller.getAllAnimesController)
  .get("/list/latest", controller.getAllAnimeByLatestEpsController)
  .get("/list/finished", controller.getAllAnimeByLastFinishedController)
  .get("/list/populer", controller.getAllAnimeByPopulerController)
  .get("/list/genres", controller.getAllAnimeGenresController)
  .get("/search", controller.getAnimeBySearchTitleController)
  .get("/:animeId", controller.getAnimeByIdController)
  .put("/:animeId", controller.putAnimeController)
  .delete("/:animeId", controller.deleteAnimeController);

module.exports = router;
