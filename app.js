const express = require("express");
const mongoose = require("mongoose");
const profileRoute = require("./routes/profileRoutes.js");
require("dotenv/config");
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(express.json());
app.use("/api", profileRoute);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
module.exports = app;
