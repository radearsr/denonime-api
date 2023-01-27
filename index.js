const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", require("./src/api/v1/users"));
app.use("/api/v1/authentications", require("./src/api/v1/authentications"));
app.use("/api/v1/animes", require("./src/api/v1/animes"));
app.use("/api/v1/episodes", require("./src/api/v1/episodes"));
app.use("/api/v1/carousel", require("./src/api/v1/carousel"));

app.get("/", (req, res) => {
  try {
    const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;
    res.send(`<center><h1>Welcome To Denonime API</h1><br>Client From ${ipAddress}<center>`);
  } catch (error) {
    res.send("Terjadi Kegagalan pada server cek log...");
  }
});

app.all("*", (req, res) => {
  res.status(404);
  res.json({
    status: "fail",
    message: "Url Not Found",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`http://localhost:${port}`);
});

module.exports = app;
