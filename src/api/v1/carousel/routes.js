const express = require("express");
const controller = require("./controller");

const router = express.Router();

router
  .post("/", controller.postCarouselController)
  .put("/:carouselId", controller.putCarouselController);

module.exports = router;
