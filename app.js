//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
var lodash_ = require('lodash');
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "This is the Home Page of your Daily Journal. You can see all your record listed below after adding a new content. Click the read more button next to each post for expanding it to a new page. For adding a new post press the compose button on the navigation bar. Happy writing!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let blogs=[];

// mongoose.connect("mongodb://localhost:27017/blogDB"); //connected with the database
mongoose.connect("mongodb+srv://admin-ekansh:Test123@cluster0.nzo3z.mongodb.net/blogDB");

const blogSchema = { //schema that will store the blog posts
  title: String,
  content: String
};

const Blog = mongoose.model("Blog", blogSchema); //wrapper of schema so that we can create and read docs from the underlying db 


app.get("/",function(req,res){

  Blog.find({},function(err,blogs){
    res.render("home",{
        homeStartingContent: homeStartingContent,
        blogs: blogs
    }); 
  });
   
});



app.get("/compose",function(req,res){
  res.render("compose");
});


app.post("/compose",function(req,res){

  const blog = new Blog({
    title: req.body.blogTitle, //blogTitle is the name of input field in the form present in compose.ejs which is used to tap into the value of title of the blog
    content: req.body.blogContent 
  })

  blog.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

// app.get("/post/:random",function(req,res){
//   // console.log(req.params.random);
//   var parameter = req.params.random;
//   var flg=false;
//   for(var i=0;i<blogs.length;i++){
//     var curtitle = blogs[i].blogTitle;
//     if(lodash_.lowerCase(parameter) === lodash_.lowerCase(curtitle)){
//       res.render("post",{blogTitle: blogs[i].blogTitle, blogContent: blogs[i].blogContent});
//     }
//     else{
//       res.redirect("/");
//     }
//   }
// }); 

app.get("/post/:random",function(req,res){
  const blogId = req.params.random; //e.g. ..../post/day-1  so blogId

  Blog.findOne({_id: blogId},function(err,blog){
    res.render("post",{
      title: blog.title,
      content: blog.content
    });
  });
});


app.post("/delete", function(req,res){

  const idDelete= req.body.button;
  Blog.findByIdAndRemove(idDelete,function(err){
  
    if(!err){
  
      console.log("successfully deleted");
  
    }
  
    res.redirect("/");
  
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
