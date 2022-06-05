const express = require("express");

const router = express.Router();

const { authenticateUser } = require("../middlewares/authenticateUser");
const { getAllTasks } = require("../controllers/taskController");

router.get("/all", [authenticateUser, getAllTasks]);

module.exports = router;