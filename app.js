var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    localStratergy = require("passport-local"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    expressSession = require("express-session");
    user      = require("./models/user.js"),
    aadhar = require("./models/aadhar.js"),
    index  = require("./routes/index.js"),
    details = require("./routes/details.js"),
    bank = require("./routes/bank.js"),
    bank_transfer = require("./routes/bank_transfer.js"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

// mongoose.connect("mongodb://localhost:27017/govtdb", {useNewUrlParser:true});
mongoose.connect("mongodb://nachijr4:PAssword00!!@ds019976.mlab.com:19976/govtdb", {useNewUrlParser:true})
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_methods"));
app.use(flash());
//--------------------passport initialize ----------------------------
passport.use(new localStratergy(user.authenticate()));
app.use(expressSession({
    secret:"This is the secret code",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//------------------------------------------------------
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error")
  next();
});

//------------------------------------------------------

app.use(index);
app.use(details);
app.use(bank);
app.use(bank_transfer);
//------------------------------------------------------
// app.listen(process.env.PORT);
app.listen(3000);


















app.get("/adduser",function(req,res){
  res.render("adduser.ejs");
});

// app.post("/add",function(req,res){
//   res.send("Hello");
//   console.log(req.body);
// });

app.post("/adduser",function(req,res){
  // var newuser = new user({username: req.body.username})
  // console.log(req.body);
  // user.register(newuser,req.body.password, function(err,newUser){
  //   if(err){console.log(err);}
  //   else{
  //     delete req.body.username;
  //     delete req.body.password;
  //     newUser.name = req.body.name;
  //     newUser.address = req.body.address;
  //     newUser.p_no = req.body.p_no;
  //     newUser.email = req.body.email;
  //     newUser.dob = req.body.dob;
  //     newUser.father = req.body.father;
  //     newUser.save();
  //     res.redirect("/adduser");
  //   }
  // });

  console.log(req.body);
  aadhar.create(req.body,function(err,newAadhar){
    if(err){console.log(err);}
    else{
      res.redirect("/addaadhar");
    }
  });
});