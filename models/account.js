var mongoose = require("mongoose");

var accountSchema =new mongoose.Schema({
    a_id: String,
    owner: String,
    balance: String,
    min_balance: String,
    transactions:[{
        details:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "transactions"
        },
        t : String
    }],
    b_id: String,
});

module.exports = mongoose.model("accounts",accountSchema);