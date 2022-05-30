const handle500 = (err, res) => {
  res.status(500).json({
    message:
      "Please open an issue in https://github.com/ulisesvina/mpore-api with the following data: " +
      err.message,
    status: 500,
  });
};

module.exports = {
    handle500,
}