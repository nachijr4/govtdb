var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    plm      = require("passport-local-mongoose");

    userSchema = new mongoose.Schema({
      username: String,
      password: String,
      name: String,
      address: String,
      p_no: String,
      email: String,
      dob: String,
      father: String,
      image: String,
      sex: String
    });

    userSchema.plugin(plm);

    module.exports = mongoose.model("user",userSchema);
