const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", require("./api/v1/users"));
app.use("/api/v1/authentications", require("./api/v1/authentications"));
app.use("/api/v1/animes", require("./api/v1/animes"));

app.all("*", (req, res) => {
  res.status(404);
  res.json({
    status: "fail",
    message: "Not Found",
  });
});

const port = 5000;
app.listen(port, () => {
  console.info(`http://localhost:${port}`);
});
