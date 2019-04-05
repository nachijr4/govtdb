var middleware={};

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

middleware.login = function(req,res,next){
    if(req.isAuthenticated()){
        res.redirect("/home");
    }
    else{
        return next();
    }
}

middleware.checkAccount = function(req,res,next){}

module.exports = middleware;