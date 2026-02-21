const Loan = require("../models/Loan");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const mongoose = require("mongoose");
const LoanDTO = require("../dto/LoanDTO");
const AccountDTO = require("../dto/AccountDTO");
const { sendZeroBalanceEmail } = require("../services/emailService");

// Calculate EMI (monthly installment) for a loan
exports.calculateEmi = (req, res) => {
  let { amount, rate, months } = req.body;

  amount = Number(amount);
  rate = Number(rate);
  months = Number(months);

  // Validate input parameters
  if (!amount || isNaN(amount) || amount <= 0 || !rate || isNaN(rate) || rate <= 0 || !months || isNaN(months) || months <= 0) {
    return res.status(400).json({ message: "Invalid loan parameters" });
  }

  const r = rate / (12 * 100);
  const emi =
    (amount * r * Math.pow(1 + r, months)) /
    (Math.pow(1 + r, months) - 1);

  res.json({ emi: Math.round(emi) });
};

// Apply for a new loan
exports.applyLoan = async (req, res) => {
  try {
    let { amount, rate, months, emi } = req.body;

    amount = Number(amount);
    rate = Number(rate);
    months = Number(months);
    emi = Number(emi);

    // Validation
    if (!amount || isNaN(amount) || amount <= 0 || !rate || isNaN(rate) || rate <= 0 || !months || isNaN(months) || months <= 0 || !emi || isNaN(emi) || emi <= 0) { // Validate loan details
      return res.status(400).json({ message: "Missing loan details" });
    }

    const loan = await Loan.create({
      user: req.user.id,
      amount,
      interestRate: rate,
      months,
      emi,
      status: "pending"   // explicit for clarity
    });

    res.json({
      message: "Loan applied successfully",
      loan: new LoanDTO(loan)
    });
  } catch (error) {
    console.error("Apply Loan Error:", error);
    res.status(500).json({ message: "Failed to apply for loan" });
  }
};

// Repay an existing loan (either EMI or full amount)
exports.repayLoan = async (req, res) => {
  try {
    let { loanId, amount } = req.body;
    amount = Number(amount);

    // Validate repayment amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid repayment amount" });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (amount > loan.amount) {
      return res.status(400).json({ message: `Repayment amount cannot be more than the outstanding loan amount of ${loan.amount}` });
    }

    if (loan.status !== "approved") {
      return res.status(400).json({ message: "Loan is not active" });
    }

    const account = await Account.findOne({ user: req.user.id });
    if (!account || account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct amount
    account.balance -= amount;
    await account.save();

    if (account.balance === 0) {
      const user = await User.findById(req.user.id);
      await sendZeroBalanceEmail(user);
    }

    // Update loan details after repayment
    loan.amount -= amount;
    if (loan.amount <= 0) {
      loan.status = "paid";
      loan.amount = 0; // Prevent negative amount
    }
    await loan.save();

    await Transaction.create({
      user: req.user.id,
      accountId: account._id,
      type: "loan_repayment",
      amount,
      transactionId: `TXN-${new mongoose.Types.ObjectId()}`
    });

    res.json({
      message: "Loan repayment successful",
      loan: new LoanDTO(loan),
      account: new AccountDTO(account)
    });
  } catch (error) {
    console.error("Repay Loan Error:", error);
    res.status(500).json({ message: "Loan repayment failed" });
  }
};
