var express = require("express"),
    passport = require("passport");
    routes     = express.Router(),
    pass = require("../models/pass.js"),
    aadhar = require("../models/aadhar.js"),
    user = require("../models/user.js"),
    middleware = require("../middleware/index.js"),
    license = require("../models/license.js");


routes.get("/viewaadhar",middleware.isLoggedIn,function(req,res){
    aadhar.findOne({username: req.user.username},function(err,foundAadhar){
        if(err){
        console.log(err);
        }
        else{
        res.render("details/viewaadhar.ejs",{foundaadhar: foundAadhar});
        }
    })
    });

routes.get("/viewpassport",middleware.isLoggedIn, function(req,res){
    pass.findOne({username:req.user.username},function(err,foundPass){
        if(err){
            console.log(err);
        }
        else{
            res.render("details/viewpassport.ejs",{foundpass: foundPass['pass_number']});
        }
    });
});

    routes.get("/viewlicense",middleware.isLoggedIn,function(req,res){
        license.findOne({username: req.user.username},function(err,foundLicense){
            if(err){console.log(err); res.redirect("/home");}
            else{
                res.render("details/license.ejs",{license: foundLicense});
            }
        });

        
});

  module.exports = routes;