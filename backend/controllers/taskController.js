const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const { runTxWithResults } = require("../utils");

// Evaluates the prerequisite status of a task.
// Modifies <txRes_> when an error is encountered.
// Returns <True> iff. the transaction should abort.
const evalPrereqs = async (session, taskBody, txRes_) => {
  try {
    const prereqDocs = await Task.find({
      _id: { $in: taskBody.prereqs },
      user_id: taskBody.user_id,
    }).session(session);

    // check that all prerequisites have been fetched
    if (prereqDocs.length != taskBody.prereqs.length) {
      txRes_.status = 400;
      txRes_.body = {
        message: "Some prerequisites do not exist",
        server_err: "",
      };

      return true;
    }

    // compute prereqs_done
    taskBody.prereqs_done = prereqDocs.reduce(
      (status, doc) => status && doc.task_done,
      true
    );

    return false;
  } catch (fetchErr) {
    if ("name" in fetchErr && fetchErr.name == "CastError") {
      // potentially invalid prereq id
      txRes_.status = 400;
      txRes_.body = {
        message: "Some prerequisites do not exist",
        server_err: "",
      };
    } else {
      txRes_.status = 500;
      txRes_.body = {
        message: "Error creating task",
        server_err: `[prereq eval] ${fetchErr.toString()}`,
      };
    }
    return true;
  }
};

// Add <taskBody._id> to the depedents list of each prereq in <taskBody.prereqs>.
// Return <True> iff. an error occurred.
const updatePrereqs = async (session, taskBody, txRes_) => {
  try {
    const updateRes = await Task.updateMany(
      { _id: { $in: taskBody.prereqs }, user_id: taskBody.user_id },
      { $push: { dependents: taskBody._id } }
    ).session(session);

    return false;
  } catch (updateErr) {
    txRes_.status = 500;
    txRes_.body = {
      message: "Error creating task",
      server_err: `[update prereqs] ${updateErr.toString()}`,
    };
    return true;
  }
};

// Creates the document corresponding to a task specified by <taskBody>.
// Modifies <txRes_> to indicate suitable success/error responses.
// Adds <._id> to <taskBody> on a successful create.
// Return <True> iff. an error occurred.
const createTaskDoc = async (session, taskBody, txRes_) => {
  try {
    const newTask = await Task.create([taskBody], { session: session });
    txRes_.status = 201;
    txRes_.body = newTask[0];
    taskBody._id = newTask[0]._id;
    return false;
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
        server_err: `[task doc create] ${err.toString()}`,
      };
    }

    return true;
  }
};

const createTaskTx = (session, taskBody) => {
  return runTxWithResults(session, async () => {
    const txRes_ = {
      status: 500,
      body: { message: "Error creating task", server_err: "" },
    };

    if (await evalPrereqs(session, taskBody, txRes_)) return txRes_;

    if (await createTaskDoc(session, taskBody, txRes_)) return txRes_;

    await updatePrereqs(session, taskBody, txRes_);

    return txRes_;
  });
};

const createTask = asyncHandler(async (req, res) => {
  const taskBody = {
    ...req.body,
    user_id: req.uid,
    task_done: false,
    dependents: [],
  };

  // The `prereqs` field is used before schema valiation occurs.
  if (!("prereqs" in req.body)) {
    res
      .status(400)
      .json({ message: "Invalid data for a task", server_err: "" });
    return;
  }

  // Starts the session to be used for the transaction
  const session = await Task.startSession();
  const txRes = await createTaskTx(session, taskBody);
  res.status(txRes.status).json(txRes.body);

  await session.endSession();
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
