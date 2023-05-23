const express = require("express");
const controller = require("./controller");

const router = express();

router
  .post("/", controller.postAnimeController)
  .get("/", controller.getAnimesBySpecController)
  .get("/list/genres", controller.getAllAnimeGenresController)
  .get("/genres/:genreSlug", controller.getAllAnimeByGenreId)
  .get("/search", controller.getAnimeBySearchTitleController)
  .get("/:animeId", controller.getAnimeByIdController)
  .put("/:animeId", controller.putAnimeController)
  .delete("/:animeId", controller.deleteAnimeController);

module.exports = router;
