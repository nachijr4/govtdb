var express = require("express"),
    passport = require("passport");
    routes     = express.Router(),
    pass = require("../models/pass.js"),
    aadhar = require("../models/aadhar.js"),
    user = require("../models/user.js"),
    account = require("../models/account.js"),
    branch = require("../models/branch");
   
routes.get("/bank",middleware.isLoggedIn,function(req,res){
    var allbranch;
    account.find({owner: req.user.username},function(err,foundAccount){
        if(err){
            req.flash("error",err.message);
            res.redirect("/home")
        }
        else{
             allbranch = [];
            for(var i=0; i<foundAccount.length ; i=i+1){
                var z = 0;
                branch.findOne({b_id: foundAccount[i].b_id},function(err,foundBranch){
                    if(err){
                        req.flash("error",err.message);
                        res.redirect("/home")
                    }
                    else{
                        allbranch.push(foundBranch);
                        if(z++ === foundAccount.length - 1){
                            res.render("bank/home.ejs",{foundAccount: foundAccount, foundBranch: allbranch});
                        }
                    }
                })
            }
            
        }
    });
});



routes.get("/bank/:a_id",middleware.isLoggedIn,function(req,res){
    account.findOne({a_id: req.params.a_id}).populate("transactions.details").exec(function(err,foundAccount){
        if(err){
            req.flash("error",err.message);
            res.redirect("/home")
        }
        else{
            branch.findOne({b_id: foundAccount.b_id},function(err,foundBranch){
                if(err){
                    req.flash("error",err.message);
                    res.redirect("/home")
                }
                else{
                    res.render("bank/show.ejs",{account: foundAccount, foundBranch: foundBranch });
                }
        });
    }
    });
});



module.exports = routes;