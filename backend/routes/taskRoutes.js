const express = require("express");

const { createTask, getAllTasks } = require("../controllers/taskController");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router = express.Router();

// Create a new task.
// POST /api/tasks/create
router.post("/create", [authenticateUser, createTask]);

// Get all tasks for a user.
// GET /api/tasks/getAll
router.get("/getAll", [authenticateUser, getAllTasks]);

module.exports = router;
