const Task = require("../models/taskModel");
const { checkValidObjectIds } = require("../utils");

// Attempts to get a user task by it's id.
// Returns null iff. one of the following errors occurred:
//  - invalid task id
//  - task doesn't exist
//  - task doesn't belong to the user
//  - some unexpected error from anywhere in the operation
// Modifies <txRes_> to error responses as needed.
const getTaskById = async (session, taskId, userId, txRes_) => {
  try {
    if (!checkValidObjectIds([taskId])) {
      txRes_.status = 400;
      txRes_.body = {
        message: "Task does not exist",
        server_err: "",
      };
      return;
    }

    const taskDoc = await Task.findOne({
      _id: taskId,
      user_id: userId,
    }).session(session);
    if (!taskDoc) {
      txRes_.status = 400;
      txRes_.body = {
        message: "Task does not exist",
        server_err: "",
      };
      return;
    }

    return taskDoc;
  } catch (err) {
    txRes_.status = 500;
    txRes_.body = {
      message: "Error marking task done",
      server_err: `[get task by id] ${err.toString()}`,
    };

    return;
  }
};

// Updates the direct dependents of a task that is marked done.
// Returns <True> iff. an unexpected error occurred.
// Modifies <txRes_> to indicate the error thrown.
const taskDoneUpdateDirects = async (session, dependents, userId, txRes_) => {
  try {
    // find all dependents
    const depTasks = await Task.find({
      _id: { $in: dependents },
      user_id: userId,
    }).session(session);

    // update each dependent
    const updateDepPromises = depTasks.map(async (taskDoc) => {
      // eval prereq status
      const prereqDocs = await Task.find({
        _id: { $in: taskDoc.prereqs },
        user_id: userId,
      }).session(session);
      const prereqsDone = prereqDocs.reduce(
        (status, t) => status && t.task_done,
        true
      );

      // update the prereq status
      await Task.findOneAndUpdate(
        { _id: taskDoc._id, user_id: taskDoc.user_id },
        { prereqs_done: prereqsDone }
      ).session(session);
    });

    await Promise.all(updateDepPromises);

    return false;
  } catch (err) {
    txRes_.status = 500;
    txRes_.body = {
      message: "Error marking task done",
      server_err: `[task done update] ${err.toString()}`,
    };

    return true;
  }
};

// Updates the task to mark it as done
// Returns <True> iff. an unexpected error occurred.
// Modifies <txRes_> to indicate the appropriate error response.
const markTaskDone = async (session, taskId, userId, txRes_) => {
  return Task.findOneAndUpdate(
    { _id: taskId, user_id: userId },
    { task_done: true }
  )
    .session(session)
    .then(() => {
      return false;
    })
    .catch((err) => {
      txRes_.status = 500;
      txRes_.body = {
        message: "Error marking task done",
        server_err: `[mark task done] ${err.toString()}`,
      };

      return true;
    });
};

module.exports = {
  markTaskDone,
  getTaskById,
  taskDoneUpdateDirects,
};
