//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Hello, User! This is a simple daily journal website. Feel free to create a new post by clicking on the blue button.";
const aboutContent = "This web application was made using node.js and mongodb.";
const contactContent = "You can contact me at anmol.swarnkar@gmail.com :).";
const app = express();

mongoose.connect("mongodb+srv://anmol:114131512@cluster0.ixxmu.mongodb.net/blogDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
// let posts = [];

const postSchema = {
  title: String, 
  body: String
}

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {

    Post.find({}, function(err, foundPosts) {
        if(!err) {
          res.render("home", {
            startingContentHTML: homeStartingContent,
            postsHTML: foundPosts
          });
        }
    });
});

app.get("/contact", function(req,res) {
    res.render("contact", {
      contactHTML: contactContent
    });
  

});

app.get("/about", function(req,res) {
    res.render("about", {
      aboutHTML: aboutContent
    });
});

app.get("/compose", function(req,res) {
  res.render("compose"); 
});

app.post("/compose", function(req, res) {
    const post = new Post({
      title: req.body.composeItemTitle,
      body: req.body.composeItemBody
    });

    if(post.title.length != 0 || post.body.length != 0) {
      post.save(function(err) {
        if(!err) {

          res.redirect("/");

        }
      });
    } else {
      res.redirect("/");
    }

});

app.post("/delete", function(req, res) {
  let postItemID = req.body.deleteButton;

  Post.findByIdAndRemove(postItemID, function(err) {
    if(!err) {
      res.redirect("/");
    }
  });

});

app.post("/edit", function(req, res){

  let postItemID = req.body.editButton;

  Post.findById(postItemID, function(err, foundPost){
    res.render("edit", {
      postHTML: foundPost
    })
  });
});

app.get("/posts/:postId", function(req,res) {
  Post.findOne({_id: req.params.postId}, function(err, post) {
    res.render("post", {
      titleHTML: post.title,
      bodyHTML: post.body, 
      postID: post._id
    });
  });
});
mongoose.set('useFindAndModify', false);
app.post("/editandpublish", function(req, res) {
  let postItemID = req.body.submitButton;
  let postItemTitle = req.body.editItemTitle;
  let postItemBody = req.body.editItemBody;

  Post.findByIdAndUpdate(postItemID, {title: postItemTitle, body: postItemBody}, function(err) {
    if(!err) {
      res.redirect("/");
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){

    console.log("Server started succesfully!");

});