const mongoose = require("mongoose");

const rdSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  monthlyAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  months: { type: Number, required: true },
  maturityDate: { type: Date, required: true },
  maturityAmount: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("RecurringDeposit", rdSchema);