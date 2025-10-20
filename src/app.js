const app = require("./config/express");

const routes = require("./routes");

const errorHandler = require("./middlewares/errorHandler");

app.use("/api", routes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ erro: "Endpoint não encontrado" });
});

module.exports = app;
