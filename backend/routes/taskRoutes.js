const express = require("express");

const { createTask } = require("../controllers/taskController");

const router = express.Router();

// Create a new task.
// POST /api/tasks/create
router.post("/create", [createTask]);

module.exports = router;