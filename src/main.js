require("dotenv");

// Dependencies
const express = require("express"),
  app = express();

// Middlewares
const crud = require("./routes/crud"),
  auth = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/crud", crud);
app.use("/auth", auth);

app.listen(8000);
