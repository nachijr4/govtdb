var express = require("express"),
    app     = express(),
    mongoose = require("mongoose");

  aadharSchema = new mongoose.Schema({
    username: String,
    aadharNo: String,
    sex:      String,
    image: String
  });

  module.exports = mongoose.model("aadhar",aadharSchema);
