const internalServerError = (err, res) => {
  res.status(500).json({
    message:
      "Please open an issue in https://github.com/ulisesvina/mpore-api with the following data: " +
      err.message,
    status: 500,
  });
  console.error(err);
}, badRequest = (err, res) => {
  res.status(400).json({
    message: err.message,
    status: 400,
    });
}, unauthorized = (err, res) => {
  res.status(401).json({
    message: "You need an authorization token to access this resource",
    status: 401,
  });
}

module.exports = {
  internalServerError,
  badRequest,
  unauthorized,
}