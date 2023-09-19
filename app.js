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

mongoose.connect("mongodb+srv://onemol:_aA114131512@cluster0.8i1yk.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
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
        } else {
          res.send(err);
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
        } else {
          res.send(err);
        }
      });
    } else {
      res.redirect("/");
    }

});


app.get("/posts/:postId", function(req,res) {
  console.log("get request triggered");
  Post.findOne({_id: req.params.postId}, function(err, post) {
    if(!err) {
      res.render("post", {
        titleHTML: post.title,
        bodyHTML: post.body, 
        postId: req.params.postId
      });
    } else {
      res.send(err);
    }
  });
});

app.delete("/posts/:postId", function(req, res) {
  console.log("delete request made.");
  Post.deleteOne({_id: req.params.postId}, function(err) {
    if(!err) {
      res.redirect("/");
    } else {
      res.send(err);
    }
  });
});

app.get("/edit/:postId", function(req, res){
  Post.findById(req.params.postId, function(err, foundPost){
    if(!err) {
      res.render("edit", {
        postHTML: foundPost, 
        postId: req.params.postId
      });
    } else {
      res.send(err);
    }
  });
});

mongoose.set('useFindAndModify', false);

app.patch("/posts/:postId", function(req, res) {
  console.log(req.body);
  Post.updateOne(
    {_id: req.params.postId}, 
    {$set: req.body},
    (err) => {
      if(!err) {
        res.redirect("/");
      } else {
        res.send(err);
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