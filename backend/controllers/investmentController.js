const Account = require("../models/Account");
const FixedDeposit = require("../models/FixedDeposit");
const RecurringDeposit = require("../models/RecurringDeposit");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const mongoose = require("mongoose");
const InvestmentDTO = require("../dto/InvestmentDTO");
const { sendZeroBalanceEmail } = require("../services/emailService");

// Open a new Fixed Deposit account
exports.openFD = async (req, res) => {
  try {
    let { amount, months } = req.body;
    amount = Number(amount);
    months = Number(months);
    const interestRate = 6.5; // Static rate for demo

    // Validate input data
    if (!amount || isNaN(amount) || amount <= 0 || !months || isNaN(months) || months <= 0) {
      return res.status(400).json({ message: "Invalid FD details" });
    }

    const account = await Account.findOne({ user: req.user.id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct the FD amount from the user's account
    account.balance -= amount;
    await account.save();

    // Check and notify for zero balance
    if (account.balance === 0) {
      const user = await User.findById(req.user.id);
      if (user) {
        await sendZeroBalanceEmail(user);
      }
    }

    // Calculate Maturity
    const maturityAmount = amount + (amount * interestRate * months) / (12 * 100);
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + Number(months));

    const fd = await FixedDeposit.create({
      user: req.user.id,
      amount,
      interestRate,
      months,
      maturityDate,
      maturityAmount
    });

    // Log the transaction
    await Transaction.create({
      user: req.user.id,
      accountId: account._id,
      type: "fd_open",
      amount,
      transactionId: `TXN-${new mongoose.Types.ObjectId()}`
    });

    const fdDTO = new InvestmentDTO({ ...fd.toObject(), userId: fd.user, type: "Fixed Deposit" });
    res.json({ message: "FD Opened successfully", fd: fdDTO });
  } catch (error) {
    console.error("Error opening FD:", error);
    res.status(500).json({ message: error.message || "Server error processing Fixed Deposit" });
  }
};




// Open a new Recurring Deposit account
exports.openRD = async (req, res) => {
  try {
    let { monthlyAmount, months } = req.body;
    monthlyAmount = Number(monthlyAmount);
    months = Number(months);
    const interestRate = 5.5; // Static rate

    // Validate input data
    if (!monthlyAmount || isNaN(monthlyAmount) || monthlyAmount <= 0 || !months || isNaN(months) || months <= 0) {
      return res.status(400).json({ message: "Invalid RD details" });
    }

    const account = await Account.findOne({ user: req.user.id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.balance < monthlyAmount) {
      return res.status(400).json({ message: "Insufficient balance for first installment" });
    }

    // Deduct the first installment from the user's account
    account.balance -= monthlyAmount;
    await account.save();

    if (account.balance === 0) {
      const user = await User.findById(req.user.id);
      if (user) {
        await sendZeroBalanceEmail(user);
      }
    }

    // Formula: P * n + (P * n(n+1)/2 * r/12 * 1/100)
    const maturityAmount = (monthlyAmount * months) + (monthlyAmount * months * (months + 1) / 2) * (interestRate / 1200);

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + Number(months));

    const rd = await RecurringDeposit.create({
      user: req.user.id,
      monthlyAmount,
      interestRate,
      months,
      maturityDate,
      maturityAmount
    });

    // Log the transaction
    await Transaction.create({
      user: req.user.id,
      accountId: account._id,
      type: "rd_open",
      amount: monthlyAmount,
      transactionId: `TXN-${new mongoose.Types.ObjectId()}`
    });

    const rdDTO = new InvestmentDTO({ ...rd.toObject(), userId: rd.user, amount: rd.monthlyAmount, type: "Recurring Deposit" });
    res.json({ message: "RD Opened successfully", rd: rdDTO });
  } catch (error) {
    console.error("Error opening RD:", error);
    res.status(500).json({ message: error.message || "Server error processing Recurring Deposit" });
  }
};

// Get all investments for a user
exports.getMyInvestments = async (req, res) => {
  try {
    const fds = await FixedDeposit.find({ user: req.user.id });
    const rds = await RecurringDeposit.find({ user: req.user.id });

    const fdDTOs = fds.map(fd => new InvestmentDTO({ ...fd.toObject(), userId: fd.user, type: "Fixed Deposit" }));
    const rdDTOs = rds.map(rd => new InvestmentDTO({ ...rd.toObject(), userId: rd.user, amount: rd.monthlyAmount, type: "Recurring Deposit" }));
    res.json({ fds: fdDTOs, rds: rdDTOs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching investments" });
  }
};