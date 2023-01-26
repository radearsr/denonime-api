const express = require("express");
const controller = require("./controller");

const router = express.Router();

router
  .post("/", controller.postCarouselController)
  .get("/", controller.getCarouselBySortbyWithPaginController)
  .get("/list", controller.getAllCarouselController)
  .put("/:carouselId", controller.putCarouselController)
  .delete("/:carouselId", controller.deleteCarouselController);

module.exports = router;
