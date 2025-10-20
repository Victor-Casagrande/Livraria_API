const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      erro: message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    res.status(statusCode).json({
      erro: message,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = errorHandler;
