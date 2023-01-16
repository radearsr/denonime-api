const express = require("express");
const controller = require("./controller");

const router = express();

router
  .post("/", controller.postAnimeController);

module.exports = router;
