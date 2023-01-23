const express = require("express");
const controller = require("./controller");

const router = express();

router
  .get("/", controller.getAnimesController)
  .get("/:animeId", controller.getAnimeByIdController)
  .post("/", controller.postAnimeController)
  .put("/:animeId", controller.putAnimeController)
  .delete("/:animeId", controller.deleteAnimeController);

module.exports = router;
