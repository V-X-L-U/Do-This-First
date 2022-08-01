const express = require("express");
const { markTaskDone } = require("../controllers/markTaskController");
const { createTask, getAllTasks } = require("../controllers/taskController");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router = express.Router();

// Create a new task.
// POST /api/tasks/create
router.post("/create", [authenticateUser, createTask]);

// Get all tasks for a user.
// GET /api/tasks/getAll
router.get("/getAll", [authenticateUser, getAllTasks]);

// Attempt to mark a task done
// PUT /api/tasks/markDone/:id
router.put("/markDone/:id", [authenticateUser, markTaskDone]);

module.exports = router;
