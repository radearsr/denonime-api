const express = require("express");
const cors = require("cors");
const ClientError = require("./exceptions/ClientError");
const errorTranslater = require("./exceptions/errorTranslater");
const configJson = require("../package.json");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/api/v1/users", require("./api/v1/users"));
app.use("/api/v1/authentications", require("./api/v1/authentications"));
app.use("/api/v1/animes", require("./api/v1/animes"));
app.use("/api/v1/episodes", require("./api/v1/episodes"));
app.use("/api/v1/carousel", require("./api/v1/carousel"));

app.use("/api/v2/animes", require("./api/v2/animes"));
app.use("/api/v2/episodes", require("./api/v2/episodes"));

app.get("/", (req, res) => {
  try {
    const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
    res.send(`
      <center>
        <h1>Welcome To Denonime API v${configJson.version}</h1>
        <h4>Client From ${ipAddress}</h4>
      <center>
    `);
  } catch (error) {
    res.send("Terjadi Kegagalan pada server cek log...");
  }
});

app.use((error, req, res, next) => {
  if (error instanceof ClientError) {
    res.statusCode = error.statusCode;
    return res.send({
      status: "fail",
      message: error.message,
    });
  }
  const resultTranslater = errorTranslater.translateErrorToResponse(error);
  res.statusCode = resultTranslater.code;
  return res.send({
    status: resultTranslater.status,
    message: resultTranslater.message,
  });
});

app.all("*", (req, res) => {
  res.statusCode = 404;
  res.json({
    status: "fail",
    message: "Url Not Found",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.info(`http://localhost:${port}`);
});

module.exports = app;
