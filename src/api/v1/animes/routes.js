const express = require("express");
const controller = require("./controller");

const router = express();

router
  .get("/", controller.getAnimesController)
  .post("/", controller.postAnimeController)
  .put("/:animeId", controller.putAnimeController)
  .delete("/:animeId", controller.deleteAnimeController);

module.exports = router;
