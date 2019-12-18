require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || "development";

const mongoose = require("mongoose");
db = require("./models");
mongoose.Promise = Promise;
const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//middleware
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static options
let options = {
  dotfiles: "ignore",
  etag: false,
  extensions: ["html"],
  redirect: false
};

//routing
app.use(express.static("public", options));
require("./routes/api-routes")(app);

//start server
app.listen(PORT, function() {
  console.log("listening " + PORT);
  console.log("environment: " + env);
});
