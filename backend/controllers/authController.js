const User = require("../models/User");
const Account = require("../models/Account");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserDTO = require("../dto/UserDTO");

// Register a new user and create a corresponding account
const register = async (req, res) => {
  try {
    const { name, email, password, initialBalance, role } = req.body;

    // Validation
    if (!name || !email || !password || initialBalance === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Number(initialBalance) < 1000) {
      return res.status(400).json({ message: "Initial balance must be at least 1000" });
    }

    // Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isActive: true
    });

    // Generate random 12 digit account ID
    const randomAccountId = Math.floor(100000000000 + Math.random() * 900000000000).toString();

    // Create Account for User
    await Account.create({
      user: user._id,
      accountId: randomAccountId,
      balance: Number(initialBalance)
    });

    console.log("User registered successfully:", user);
    return res.status(201).json({
      message: "User registered successfully and account created",
      user: new UserDTO(user)
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login user and provide JWT token
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  let user;
  try {
    user = await User.findOne({ email, isActive: true });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found or inactive" });
    }
  } catch (dbError) {
    console.error("Database error during login:", dbError);
    return res.status(500).json({ message: "Database error during login" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: new UserDTO(user)
  });
};

// LOGOUT
const logout = async (req, res) => {
  res.json({ message: "Logout successful" });
};

module.exports = {
  register,
  login,
  logout
};
