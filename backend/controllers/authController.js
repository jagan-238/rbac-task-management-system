const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const generateToken = require("../utils/generateToken");

// @desc Register a new user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "admin" ? "admin" : "user",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account has been deactivated",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    await ActivityLog.create({
      userId: user._id,
      action: "LOGIN",
      description: `${user.name} logged in`,
    });

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  register,
  login,
  getMe,
};