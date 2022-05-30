require("dotenv");

// Dependencies
const express = require("express"),
  app = express();

// Middlewares
const crud = require("./routes/crud"),
  auth = require("./routes/auth"),
  fetch = require("./routes/fetch"),
  verifyToken = require("./middlewares/verify-token");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/crud", verifyToken, crud);
app.use("/auth", auth);
app.use("/fetch", fetch);

app.listen(8000);
