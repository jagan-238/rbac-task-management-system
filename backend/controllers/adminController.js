const User = require("../models/User");
const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");

// ==================== USER MANAGEMENT ====================

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update user status (active/inactive)
// @route PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot change your own status" });
    }

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a user
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    // Delete all tasks and logs belonging to this user
    await Task.deleteMany({ userId: user._id });
    await ActivityLog.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ message: "User and their data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== TASK MANAGEMENT ====================

// @desc  Get all tasks (admin view)
// @route GET /api/admin/tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Admin delete any task
// @route DELETE /api/admin/tasks/:id
const adminDeleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: "TASK_DELETED",
      description: `Admin deleted task: "${task.title}"`,
    });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ACTIVITY LOGS ====================

// @desc  Get all activity logs
// @route GET /api/admin/logs
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(100); // limit to last 100 logs
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ANALYTICS ====================

// @desc  Get analytics data
// @route GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    // Use aggregation to get task stats in one query
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();

    // Map aggregation result to readable format
    let completedTasks = 0;
    let pendingTasks = 0;

    taskStats.forEach((stat) => {
      if (stat._id === "completed") completedTasks = stat.count;
      if (stat._id === "pending") pendingTasks = stat.count;
    });

    res.json({
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllTasks,
  adminDeleteTask,
  getActivityLogs,
  getAnalytics,
};
