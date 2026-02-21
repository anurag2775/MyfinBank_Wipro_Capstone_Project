const Account = require("../models/Account");
const User = require("../models/User");
const Loan = require("../models/Loan");
const AccountDTO = require("../dto/AccountDTO");

/**
 * Get all users (for admin Manage Users)
 * GET /api/admin/users
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("name email role isActive _id");
    res.json(users);
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Toggle user active/inactive status
 * PUT /api/admin/users/:id/status
 */
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: "User status updated", user: { _id: user._id, isActive: user.isActive } });
  } catch (error) {
    console.error("Admin Toggle User Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 *    Create a new bank account for a user
 *    POST /api/admin/accounts
 *   Private/Admin
 */
exports.createAccountForUser = async (req, res) => {
  try {
    const { userId, initialBalance } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingAccount = await Account.findOne({ user: userId });
    if (existingAccount) {
      return res.status(400).json({ message: "User already has an account" });
    }

    const newAccount = await Account.create({
      user: userId,
      balance: Number(initialBalance) || 0,
      isActive: true,
    });

    res.status(201).json({
      message: "Account created successfully",
      account: new AccountDTO(newAccount),
    });
  } catch (error) {
    console.error("Admin Create Account Error:", error);
    res.status(500).json({ message: "Server error while creating account" });
  }
};

/**
 *    Get account details for a specific user by User ID
 *   GET /api/admin/accounts/user/:userId
 *   Private/Admin
 */
exports.getAccountByUserId = async (req, res) => {
  try {
    const account = await Account.findOne({ user: req.params.userId }).populate("user", "name email");
    if (!account) {
      return res.status(404).json({ message: "Account not found for this user" });
    }
    res.json(new AccountDTO(account));
  } catch (error) {
    console.error("Admin Get Account Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all loans (for admin Approve Loans page)
 * GET /api/admin/loans
 */
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find({}).populate("user", "name email").sort({ _id: -1 });
    res.json(loans);
  } catch (error) {
    console.error("Admin Get Loans Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Approve or Deny a Loan application
 * PUT /api/admin/loans/:loanId
 * Body: { status: 'approved' | 'rejected' } (rejected is stored as 'denied' in DB)
 */
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const { loanId } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.status = status === "rejected" ? "denied" : status;
    await loan.save();

    res.json({ message: `Loan ${status} successfully`, loan });
  } catch (error) {
    console.error("Admin Loan Update Error:", error);
    res.status(500).json({ message: "Server error updating loan status" });
  }
};

/*
 * Update a customer's account (e.g., type or status)
 * @route   PUT /api/admin/accounts/:accountId
 */
exports.updateAccount = async (req, res) => {
  try {
    const { balance, isActive } = req.body;

    const account = await Account.findById(req.params.accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (typeof isActive === "boolean") {
      if (isActive === false && account.balance > 0) {
        return res.status(400).json({ message: "Cannot deactivate an account with a positive balance." });
      }
      account.isActive = isActive;
    }

    if (typeof balance === "number" && balance >= 0) {
      account.balance = balance;
    }

    await account.save();

    res.json({
      message: "Account updated successfully",
      account: new AccountDTO(account),
    });
  } catch (error) {
    console.error("Admin Update Account Error:", error);
    res.status(500).json({ message: "Server error while updating account" });
  }
};

/*
 * Get all customer accounts
 * @route   GET /api/admin/accounts
 */
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({}).populate("user", "name email");
    const accountDTOs = accounts.map(acc => new AccountDTO(acc));
    res.json(accountDTOs);
  } catch (error) {
    console.error("Admin Get All Accounts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a user's account (only if balance is 0)
 * DELETE /api/admin/accounts/:accountId
 */
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.balance !== 0) {
      return res.status(400).json({ message: "Cannot delete account with non-zero balance. Withdraw or transfer first." });
    }
    await Account.findByIdAndDelete(req.params.accountId);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Account Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};