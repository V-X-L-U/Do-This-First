const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

const createTask = asyncHandler(async (req, res) => {
  const taskBody = {
    ...req.body,
    user_id: req.uid,
  };
  const newTask = await new Task(taskBody);

  await newTask
    .save()
    .then((result) => {
      // 201 --> http create success status code
      res.status(201).json(result);
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        const errorMessage = "Invalid data for a task";
        // 400 --> server won't/can't process request due to a perceived
        // client error
        res.status(400).json({ message: errorMessage, server_err: err.name });
      }

      const errorMessage = "Error creating task";
      // 500 --> something went wrong server-side
      res.status(500).json({ message: errorMessage, server_err: "" });
    });
});

const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.uid });
    res.status(200).json({ tasks: tasks });
  } catch (err) {
    const errorResponse = {
      message: "Error getting tasks for user",
      server_err: err.name,
    };

    res.status(500).json(errorResponse);
  }
});

module.exports = {
  createTask,
  getAllTasks,
};
