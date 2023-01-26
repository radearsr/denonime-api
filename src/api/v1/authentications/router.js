const express = require("express");
const controller = require("./controller");

const router = express.Router();

router
  .post("/", controller.postUserAuthenticationController)
  .put("/", controller.putAccessTokenController)
  .delete("/", controller.deleteRefreshTokenController);

module.exports = router;
