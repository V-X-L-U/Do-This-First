const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const { runTxWithResults } = require("../utils");

const createTask = asyncHandler(async (req, res) => {
  const taskBody = {
    ...req.body,
    user_id: req.uid,
    task_done: false,
    dependents: [],
  };

  if (!("prereqs" in req.body)) {
    res
      .status(400)
      .json({ message: "Invalid data for a task", server_err: "" });
    return;
  }

  console.log("[Create Task] Starting mongo session ...");
  // Starts the session to be used for the transaction
  const db = await mongoose.createConnection(process.env.ATLAS_URI).asPromise();
  const session = await db.startSession();
  console.log("[Create Task] Mongo session started. Preparing transaction ...");

  const txRes = await runTxWithResults(session, async () => {
    const txRes_ = {
      status: 500,
      body: { message: "Error creating task", server_err: "" },
    };

    try {
      const prereqDocs = await Task.find({
        _id: { $in: req.body.prereqs },
        user_id: req.uid,
      }).session(session);
    } catch (fetchErr) {
      txRes_.status = 500;
      txRes_.body = {
        message: "Error creating task",
        server_err: fetchErr.toString(),
      };
      return txRes_;
    }

    // compute prereqs_done
    const prereqs_done = prereqDocs.reduce(
      (status, doc) => status && doc.task_done,
      true
    );
    taskBody.prereqs_done = prereqs_done;

    try {
      const newTask = await Task.create([taskBody], { session: session });
      txRes_.status = 201;
      txRes_.body = newTask[0];
    } catch (err) {
      if ("name" in err && err.name == "ValidationError") {
        txRes_.status = 400;
        txRes_.body = {
          message: "Invalid data for a task",
          server_err: err.name,
        };
      } else {
        txRes_.status = 500;
        txRes_.body = {
          message: "Error creating task",
          server_err: err.toString(),
        };
      }
    }

    return txRes_;
  });
  res.status(txRes.status).json(txRes.body);

  await session.endSession();

  console.log("[Create Task] Session ended.");
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
