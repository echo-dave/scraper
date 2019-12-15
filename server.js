require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || "development";

const mongoose = require("mongoose");
db = require("./models");
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const axios = require("axios");
const cheerio = require("cheerio");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

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
app.get("/get", function(req, res) {
  axios.get("http://www.fcp.co").then(function(response) {
    const $ = cheerio.load(response.data);

    //get titles
    let articles = [];
    let title = $(".leading-0 h2.item-title")
      .text()
      .replace(/\n+|\t+/g, "");

    let summary = $(".leading-0 p:first-of-type").text();

    let url = $("p.readmore a").attr("href");

    articles.push({
      title: title,
      summary: summary,
      url: "http://www.fcp.co" + url
    });

    $(".items-row").each(function(i, element) {
      let title = $(element)
        .find("h2.item-title")
        .text()
        .replace(/\n+|\t+/g, "");

      let summary = $(element)
        .find("p:nth-last-of-type(2)")
        .text();

      let url = $(element)
        .find("p.readmore a")
        .attr("href");

      articles.push({
        title: title,
        summary: summary,
        url: "http://www.fcp.co" + url
      });
    });
    console.log(articles);
    console.log("--------------------");
    let addArticles = [];
    console.log("article length " + articles.length);

    for (let i = 0; i < articles.length; i++) {
      db.Scrape.find(articles[i]).then(function(data) {
        //console.log(res);
        if (data.length == 0) {
          addArticles.push(articles[i]);
        }
        if (i == articles.length - 1) {
          console.log(addArticles);
          db.Scrape.insertMany(addArticles).then(function(dataPushed) {
            res.json(dataPushed);
          });
        }
        //  console.log(addArticles);
      });
    }
    // console.log("<------------------->");
  });

  //add to database
  /* db.Scrape.insertMany(articles).then(function(articles){
              res.json(articles);
          }) */
});

//start server
app.listen(PORT, function() {
  console.log("listening " + PORT);
  console.log("environment: " + env);
});
