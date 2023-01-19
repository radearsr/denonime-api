const express = require("express");
const controller = require("./controller");

const router = express();

router
  .post("/", controller.postAnimeController)
  .put("/:animeId", controller.putAnimeController)
  .delete("/:animeId", controller.deleteAnimeController);

module.exports = router;
