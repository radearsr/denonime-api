const { Router } = require("express");
const controllers = require("./controllers");

const router = Router();

router
  .post("/", controllers.postAnimeController)
  .put("/:animeId", controllers.putAnimeController)
  .delete("/:animeId", controllers.deleteAnimeController);

module.exports = router;
