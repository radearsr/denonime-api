const { Router } = require("express");
const controllers = require("./controllers");

const router = Router();

router
  .post("/", controllers.postAnimesController);

module.exports = router;
