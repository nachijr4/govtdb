var mongoose = require("mongoose");

var transactionsSchema = new mongoose.Schema({
    s_id: String,
    r_id: String,
    description: String,
    amount: Number,
    createdAt: String
}
);

module.exports = mongoose.model("transactions",transactionsSchema);