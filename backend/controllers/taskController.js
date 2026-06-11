const Task = require("../models/Task");
const ActivityLog = require("../models/ActivityLog");

// @desc  Create a new task
// @route POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      userId: req.user._id,
    });

    await ActivityLog.create({
      userId: req.user._id,
      action: "TASK_CREATED",
      description: `Created task: "${task.title}"`,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get tasks for logged in user
// @route GET /api/tasks
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a task
// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Make sure the task belongs to the logged in user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    await ActivityLog.create({
      userId: req.user._id,
      action: "TASK_UPDATED",
      description: `Updated task: "${updatedTask.title}"`,
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Users can only delete their own tasks
    if (task.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this task" });
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: "TASK_DELETED",
      description: `Deleted task: "${task.title}"`,
    });

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getMyTasks, updateTask, deleteTask };
