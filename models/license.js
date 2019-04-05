var mongoose = require("mongoose");

// var passportSchema = new mongoose.Schema({
//     username: String,
//     pass_number: String
// });

module.exports = mongoose.model("licences",{username: String, l_no: String});