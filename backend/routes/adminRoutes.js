const express = require('express');
const router = express.Router();

// Assuming other admin functions are imported here
const {
  createAccountForUser,
  getAccountByUserId,
  updateAccount,
  getAllAccounts,
  updateLoanStatus,
  getAllLoans,
  getUsers,
  toggleUserStatus,
  deleteAccount
} = require('../controllers/adminController');

// Assuming you have this middleware for protecting admin routes
const protect = require('../middleware/authMiddleware');

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// User management (for Manage Users page)
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/status', protect, admin, toggleUserStatus);

// Customer Account Management Routes 

router.route('/accounts')
  .get(protect, admin, getAllAccounts) // Get all accounts
  .post(protect, admin, createAccountForUser); // Create a new account

// GET an account by user ID
router.route('/accounts/user/:userId').get(protect, admin, getAccountByUserId);

// PUT to update an account (balance, isActive); DELETE account
router.route('/accounts/:accountId')
  .put(protect, admin, updateAccount)
  .delete(protect, admin, deleteAccount);

// List all loans (admin); approve/reject a loan
router.get('/loans', protect, admin, getAllLoans);
router.put('/loans/:loanId', protect, admin, updateLoanStatus);

module.exports = router;