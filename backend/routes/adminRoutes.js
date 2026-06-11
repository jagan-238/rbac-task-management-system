const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllTasks,
  adminDeleteTask,
  getActivityLogs,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All admin routes require authentication AND admin role
router.use(protect, adminOnly);

// User management
router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Task management
router.get("/tasks", getAllTasks);
router.delete("/tasks/:id", adminDeleteTask);

// Activity logs
router.get("/logs", getActivityLogs);

// Analytics
router.get("/analytics", getAnalytics);

module.exports = router;
