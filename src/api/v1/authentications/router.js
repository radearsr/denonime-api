const express = require("express");
const controller = require("./controller");

const router = express.Router();

router
  .post("/", controller.postUserAuthentication)
  .put("/", controller.putAccessToken)
  .delete("/", controller.deleteRefreshToken);

module.exports = router;
