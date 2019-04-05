var express = require("express"),
    passport = require("passport");
    routes     = express.Router(),
    middleware = require("../middleware/index.js");



//  Check about redirect(back)
routes.get("/login",middleware.login,function(req,res){
    res.render("login1.ejs");
  });

  routes.get("/",function(req,res){
    res.redirect("/login");
  })

routes.post("/login",middleware.login,passport.authenticate("local",{successRedirect: "/loginsuccess", failureRedirect: "/loginfailed"}) ,function(req,res){});

routes.get("/loginsuccess",middleware.isLoggedIn,function(req,res){
  req.flash("success","Welcome to GovtDB");
  res.redirect("/home");
});

routes.get("/loginfailed",middleware.login,function(req,res){
  req.flash("error","Wrong Username / Password");
  res.redirect("/login");
});

routes.get("/logout",middleware.isLoggedIn,function(req,res){
  req.logout();
  res.redirect("/login");
});

routes.get("/home",middleware.isLoggedIn,function(req,res){
  res.render("index/home.ejs");
});

module.exports = routes;