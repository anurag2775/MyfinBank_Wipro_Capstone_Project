const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const mongoose = require("mongoose");
const AccountDTO = require("../dto/AccountDTO");
const { sendZeroBalanceEmail } = require("../services/emailService");

/* COMMON HELPER */
/*  Utility function to check and notify on zero balance */
const checkAndNotifyZeroBalance = async (userId, balance) => {
  if (balance === 0) {
    const user = await User.findById(userId);
    if (user) {
      await sendZeroBalanceEmail(user);
    }
  }
};


/*  Deposit funds (no session/transaction for standalone MongoDB) */
exports.deposit = async (req, res) => {
  try {
    let { amount } = req.body;
    amount = Number(amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const account = await Account.findOne({ user: req.user.id });

    if (!account) {
      console.error(`Account not found for user: ${req.user.id}`);
      return res.status(404).json({ message: "Account not found. Please contact support." });
    }

    account.balance += amount;
    await account.save();

    await Transaction.create({
      user: req.user.id,
      accountId: account._id,
      type: "deposit",
      amount,
      transactionId: `TXN-${new mongoose.Types.ObjectId()}`
    });

    const accountDTO = new AccountDTO(account);
    res.json(accountDTO);
  } catch (error) {
    console.error("Deposit error:", error);
    console.error("Deposit error stack:", error.stack);
    const msg = error.message || "Deposit failed. Please try again.";
    res.status(500).json({ message: msg });
  }
};

/* WITHDRAW - No session/transaction so it works on standalone MongoDB */
/*  Withdraw funds (no session/transaction for standalone MongoDB) */
exports.withdraw = async (req, res) => {
  try {
    let { amount } = req.body;
    amount = Number(amount);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const account = await Account.findOne({ user: req.user.id });

    if (!account) {
      console.error(`Account not found for user: ${req.user.id}`);
      return res.status(404).json({ message: "Account not found. Please contact support." });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: `Insufficient balance. Your current balance is ₹${account.balance}` });
    }

    account.balance -= amount;
    await account.save();

    await Transaction.create({
      user: req.user.id,
      accountId: account._id,
      type: "withdraw",
      amount,
      transactionId: `TXN-${new mongoose.Types.ObjectId()}`
    });

    await checkAndNotifyZeroBalance(req.user.id, account.balance);

    res.json(new AccountDTO(account));
  } catch (error) {
    console.error("Withdraw error:", error);
    res.status(500).json({ message: error.message || "Withdrawal failed. Please try again." });
  }
};
