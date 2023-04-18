const express = require("express");
const controller = require("./controller");

const router = express();

router
  .post("/", controller.postAnimeController)
  .get("/", controller.getAnimesByTypeWithPaginController)
  .get("/list", controller.getAllAnimesController)
  .get("/list/genres", controller.getAllAnimeGenresController)
  .get("/list/latest", controller.getAllAnimeLatestUpdate)
  .get("/list/finished", controller.getAllAnimePopulerController)
  .get("/search", controller.getAnimeBySearchTitleController)
  .get("/:animeId", controller.getAnimeByIdController)
  .put("/:animeId", controller.putAnimeController)
  .delete("/:animeId", controller.deleteAnimeController);

module.exports = router;
