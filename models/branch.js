var mongoose = require("mongoose");

var branchSchema =new mongoose.Schema({
    b_id: String,
    zipcode: String,
    ifsc: String,
    manager_name: String,
    bank_name: String,
    image: String
});

module.exports = mongoose.model("branchs",branchSchema);