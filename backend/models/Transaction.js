const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account"
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw", "transfer", "transfer_received", "loan_repayment", "fd_open", "rd_open"],
    required: true
  },
  amount: Number,
  transactionId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
