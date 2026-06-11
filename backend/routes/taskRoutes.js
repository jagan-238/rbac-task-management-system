const express = require("express");
const router = express.Router();
const {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All task routes require authentication

router.route("/").get(getMyTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);

module.exports = router;
