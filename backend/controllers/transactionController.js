const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const mongoose = require("mongoose");
const TransactionDTO = require("../dto/TransactionDTO");
const {
  sendZeroBalanceEmail,
  sendTransferNotificationEmail,
} = require("../services/emailService");

// Perform a money transfer from one account to another
exports.transfer = async (req, res) => {
  try {
    let { recipient, amount } = req.body;
    amount = Number(amount);

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer amount" });
    }

    // Sender account
    const fromAccount = await Account.findOne({ user: req.user.id });

    if (!fromAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    let toAccount;
    let toUser;

    // Strict finding by accountId
    toAccount = await Account.findOne({ accountId: recipient });

    if (toAccount) {
      // Prevent self transfer by accountId
      if (fromAccount.accountId === recipient) {
        return res.status(400).json({ message: "Cannot transfer to your own account" });
      }
    } else {
      return res.status(404).json({ message: "Recipient account ID not found" });
    }

    if (!toAccount) {
      return res.status(404).json({ message: "Recipient account not found" });
    }

    // If 'toUser' is not populated yet (was found by ID), get it now for email.
    if (!toUser) {
      toUser = await User.findById(toAccount.user);
    }

    // Balance check
    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Perform transfer
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    const fromUser = await User.findById(req.user.id);

    if (fromAccount.balance === 0) {
      // Send Zero Balance Email Alert
      await sendZeroBalanceEmail(fromUser);
    }

    // Send notification emails to sender and receiver
    await sendTransferNotificationEmail(fromUser, toUser, amount);

    const sharedTransactionId = `TXN-${new mongoose.Types.ObjectId()}`;

    // Save transaction for Sender
    const transaction = await Transaction.create({
      user: req.user.id,
      accountId: fromAccount._id,
      type: "transfer",
      amount,
      transactionId: sharedTransactionId
    });

    // Save transaction for Receiver
    await Transaction.create({
      user: toAccount.user,
      accountId: toAccount._id,
      type: "transfer_received",
      amount,
      transactionId: sharedTransactionId
    });

    res.json({ message: "Transfer successful", transaction: new TransactionDTO(transaction) });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ message: "Transfer failed due to server error" });
  }
};
