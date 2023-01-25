const express = require("express");
const controller = require("./controller");

const router = express.Router();

router
  .get("/", controller.getCarouselController)
  .get("/list", controller.getAllCarouselController)
  .post("/", controller.postCarouselController)
  .put("/:carouselId", controller.putCarouselController)
  .delete("/:carouselId", controller.deleteCarouselController);

module.exports = router;
