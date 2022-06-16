const express = require("express");

const { createTask } = require("../controllers/taskController");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router = express.Router();

// Create a new task.
// POST /api/tasks/create
router.post("/create", [authenticateUser, createTask]);

module.exports = router;