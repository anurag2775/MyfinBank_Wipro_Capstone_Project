const mongoose = require("mongoose"); 
const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  interestRate: Number,
  months: Number,
  emi: Number,
  status: {
    type: String,
    enum: ["pending", "approved", "denied"],
    default: "pending"
  }
});

module.exports = mongoose.model("Loan", loanSchema);
