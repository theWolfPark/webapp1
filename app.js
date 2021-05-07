//jshint esversion:6
//6 - Passport, OAuth 2.0 with Google/Facebook
//cd ~/vscode/the\ complete\ 2020\ web\ development/authentication/secrets
//npm init -y
//npm i express ejs body-parser- installs all these 3 packages
//npm i jsdom for jquerry use
//npm i jquery for jquerry use
//npm i mongoose-encryption
//npm i dotenv
//touch .env create .env file from terminal
//npm i md5 hashing
//npm i bcrypt hashing and salting
//npm install passport-google-oauth20
//npm install mongoose-findorcreate
require('dotenv').config() //needs to be at the first line of app.js
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("cookie-session");
// const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const FacebookStrategy = require("passport-facebook").Strategy;
const { post } = require('jquery');


const app = express();
 
const port = process.env.PORT || 3000;
 
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(session({     // this session code needs to be at this exact location between mongoose.connect below and app.use express above
  secret: "This is the real secret",
  resave: false,
  saveUninitialized: false,

}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true //required mongo version >=3.1.0

});

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email:  String,
  password: String,
  googleId: String,
  secret: String,
  facebookId: String,

});

const postSchema = {
  title: {type: String},
  content: {type: String}
};




userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema); //create new model
const Post = mongoose.model("Post", postSchema );


passport.use(User.createStrategy());


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},

function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  // User.findOrCreate({googleId: profile.id }, function (err, user) { //doesnt allow multiple null users
  //   return cb(err, user);
  // });

  User.findOrCreate({username: profile.emails[0].value, googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/secrets"
},

function(accessToken, refreshToken, profile, cb) {
  console.log(profile);

  User.findOrCreate({
    facebookId: profile.id
  }, function(err, user) {
    return cb(err, user);
  });
}
));

// app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
 
app.get('/', function(req, res){
  res.render('home');
});


// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] //doesnt allow multiple null users

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', "email"] 
}));


app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect profile.
    res.redirect('/profile');
  });

  app.get("/auth/facebook",
  passport.authenticate("facebook")
);

app.get("/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect profile.
    res.redirect("/profile");
  });

app.get('/login', function(req, res){
  res.render('login');
});
 
app.get('/register', function(req, res){
  res.render('register');
});

app.get("/profile", function(req, res){
  if(req.isAuthenticated()){   // authenticates user before accessing profile page
    res.render("profile");
  }else{
    res.redirect("/login");
  }
});

app.post("/register", function(req, res){
  
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/profile");
      });
    }
  });

});


app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/")
});

// cookies get deleted everytime we start the server and we have to sign in again otherwise the browser saves the cookies and we don't have to log in again
app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/profile");
      });
    }
  });
  
});


///profile
// app.get("/profile", function(req, res){
//   res.render("profile")
// });

/////weatherapp
app.get("/weatherapp", function(req, res){
  if(req.isAuthenticated()){   // authenticates user before accessing weatherapp page
    res.render("weatherapp");
  }else{
    res.redirect("/login");
  }
});

 


//////blog
/////////compose
app.get("/blog", function(req, res){
  if(req.isAuthenticated()){   // authenticates user before accessing blog page
    Post.find({}, function(err, posts){
      res.render("blog", {
        posts: posts
        });
    });  
  
  }else{
    res.redirect("/login");
  }
});


app.get("/compose", function(req, res){
  if(req.isAuthenticated()){   // authenticates user before accessing compose page
    res.render("compose");
  }else{
    res.redirect("/login");
  }
});

app.post("/compose", function(req, res){
  
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save(function(err){
    if (!err){
        res.redirect("/blog");
    }
  });
});


app.get("/posts/:postId", function(req, res){
  
  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    });
  
  });


app.listen(port, () => console.log(`Server started at port: ${port}`)
);



//1 - no encryption
//2 - mongoose encryption
//3 - md5 hashing
//4 - salting and hashing with bcrypt
//5 - Using passport.js to add cookies and sessions
//6 - Passport, OAuth 2.0 with Google/Facebook