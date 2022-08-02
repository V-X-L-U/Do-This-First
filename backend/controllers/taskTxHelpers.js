const Task = require("../models/taskModel");
const { checkValidObjectIds } = require("utils");

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

module.exports = { evalPrereqs, updatePrereqs };
