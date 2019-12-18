//get news to populate from database
getNews();
function getNews() {
  $("#news").empty();
  $.get("/news", function(data) {
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      $("#news").append(`
  <div id="${data[i]._id}" class="box">
     <h2 class="title is-2"> ${data[i].title} </h2>
     <p>${data[i].summary}</p>
     </p> <a href="${data[i].url}">Read More</a></p>
      <button class="button is-medium is-dark commentbtn" data-id="${data[i]._id}">Comment</button>
  <h2 style="margin-top:1em"; class="title is-3">Comments</h2>`);

      for (let j = 0; j < data[i].comments.length; j++) {
        $(`#${data[i]._id}`)
          .append(`<div id="${data[i].comments[j]._id}" class="card" style="background-color:#eee;min-height:2em;margin:1em;padding:1em;"><div class="delete">X</div>
        ${data[i].comments[j].comment}
        </div>
        `);
      }
    }
  })

    // apply click events after populating page
    .then(function() {
      //modal for commenting
      $("button").on("click", function(e) {
        console.log("click");

        $("body").append(`
  <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
       
              <textarea class="textarea" name="${$(this).attr(
                "data-id"
              )}" placeholder="Comment Here"></textarea>
              <button class="button is-primary" name="comment">Submit</button>
              <button class="modal-close is-large" aria-label="close"></button>
          
      </div>

  </div>
  `);
        //submit / post comment button and remove modal
        $("button[name=comment]").on("click", function() {
          e.preventDefault();
          let comment = {
            _id: $("textarea").attr("name"),
            comments: $("textarea").val()
          };

          $.post("/comment", comment, function(res) {
            console.log(res);
          }).then(function() {
            $(".modal").remove();
            getNews();
          });
          console.log(comment);
        });

        $(".modal-background").on("click", function(e) {
          $(".modal").remove();
        });
      });

      $(".delete").on("click", function(event) {
        let commentId = {
          id: $(this)
            .parent()
            .attr("id")
        };
        console.log(commentId);
        $(this)
          .parent()
          .remove();
        $.post("/deletcomment", commentId, function(data) {
          console.log(data);
        });
        // .then(getNews());
      });
    });

  $("#scrape").on("click", function(e) {
    $.get("/getNews", function(data) {
      console.log(data);
    }).then(function() {
      location.reload();
    });
  });

  $("#drop").on("click", function() {
    $.post("/dropall", function() {
      window.location.reload();
    });
  });
}
