const express = require("express");
const controller = require("./controller");

const router = express();

router
  .get("/", controller.getAnimesController)
  .get("/list", controller.getAllAnimesController)
  .get("/search", controller.getAnimeBySearch)
  .get("/:animeId", controller.getAnimeByIdController)
  .post("/", controller.postAnimeController)
  .put("/:animeId", controller.putAnimeController)
  .delete("/:animeId", controller.deleteAnimeController);

module.exports = router;
