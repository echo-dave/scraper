const axios = require("axios");
const cheerio = require("cheerio");
module.exports = function(app) {
  app.get("/getnews", function(req, res) {
    axios.get("http://www.fcp.co").then(function(response) {
      const $ = cheerio.load(response.data);

      //scrape titles, summary, url into articles array
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

      //determin if aricles exist in database. if not push inot addArticles array to be pushed into database
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
        });
      }
    });
  });
  //get news listings for index page
  app.get("/news", function(req, res) {
    db.Scrape.find()
      .populate("comments")
      .sort({ _id: "asc", comments: "desc" })
      .then(function(news) {
        res.json(news);
      });
  });
  //process comments
  app.post("/comment", function(req, res) {
    console.log("req.body");

    console.log(req.body);

    db.Comment.create({ comment: req.body.comments }).then(function(comment) {
      console.log("create comment then");

      console.log(comment);
      //add the comment to the articles
      db.Scrape.findOneAndUpdate(
        { _id: req.body._id },
        { $push: { comments: comment._id } }
      )
        .then(function(response) {
          console.log(response);
          res.json(response);
        })
        .catch(function(err) {
          console.log(err);
          res.json(err);
        });
    });
  });

  //delete comment
  app.post("/deletcomment", function(req, res) {
    console.log(req.body);

    db.Comment.findOneAndDelete({ _id: req.body.id }).then(function(data) {
      console.log("deleted");
      console.log(data);
      res.json(data);
    });
  });

  //drop collections
  app.post("/dropall", function(req, res) {
    db.Scrape.collection
      .drop()
      .then(function() {
        db.Comment.collection.drop();
      })
      .then(function() {
        res.send("dropped");
      });
  });
};
