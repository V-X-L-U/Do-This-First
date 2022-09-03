const Task = require("../models/taskModel");
const TxError = require("./txError");
const { produce500TxErr, checkValidObjectIds } = require("../utils");

const produceNoTaskDeletedErr = (txRes) => {
  txRes.status = 400;
  txRes.body = { message: "No task was deleted", server_err: "" };
};

// Return <True> iff. the transaction should abort as no task was deleted.
const deleteTaskDoc = async (session, txRes, taskId, userId) => {
  try {
    const deleteRes = await Task.deleteOne({
      _id: taskId,
      user_id: userId,
    }).session(session);

    if (deleteRes.deletedCount === 0) {
      produceNoTaskDeletedErr(txRes);

      return true;
    }
  } catch (err) {
    produce500TxErr(txRes, "Error deleting task", "delete task doc", err);
    return true;
  }

  return false;
};

// Return the dependents list of task specified by <taskId> and <userId>.
// If task was not found, return null.
const getDependentsList = async (session, txRes, taskId, userId) => {
  try {
    if (!checkValidObjectIds([taskId])) {
      produceNoTaskDeletedErr(txRes);
      txRes.body.server_err = "Invalid ObjectId";
      return null;
    }

    const retrieveRes = await Task.findOne({
      _id: taskId,
      user_id: userId,
    }).session(session);

    if (!retrieveRes) {
      produceNoTaskDeletedErr(txRes);

      return null;
    }

    return retrieveRes.dependents;
  } catch (err) {
    produce500TxErr(txRes, "Error deleting task", "get deps", err);
    return null;
  }
};

// Remove the task id of the deleted task from the prerequisite list of every
// dependent. Return <True> iff. the transaction should abort.
const disconnectDependentEdges = async (
  session,
  txRes,
  depsIdList,
  taskId,
  userId
) => {
  try {
    const udpateRes = await Task.updateMany(
      {
        _id: { $in: depsIdList },
        user_id: userId,
      },
      { $pull: { prereqs: taskId } }
    ).session(session);
  } catch (err) {
    produce500TxErr(txRes, "Error deleting task", "disconnect edges", err);
    return true;
  }

  return false;
};

// Update the direct dependents of the deleted task. Return <True> iff. the
// transaction should abort.
const taskDeleteUpdateDirects = async (session, txRes, depsIdList, userId) => {
  try {
    const depTasks = await Task.find({
      _id: { $in: depsIdList },
      user_id: userId,
    }).session(session);

    const updateDepPromises = depTasks.map(async (taskDoc) => {
      // See proof of correctness.
      if (taskDoc.prereqs_done) return;

      const prereqDocs = await Task.find({
        _id: { $in: taskDoc.prereqs },
        user_id: userId,
      }).session(session);
      const prereqsDone = prereqDocs.reduce(
        (status, t) => status && t.task_done,
        true
      );

      await Task.findOneAndUpdate(
        { _id: taskDoc._id, user_id: taskDoc.user_id },
        { prereqs_done: prereqsDone }
      ).session(session);
    });

    await Promise.all(updateDepPromises);
  } catch (err) {
    produce500TxErr(txRes, "Error deleting task", "update directs", err);
    return true;
  }

  return false;
};

module.exports = {
  deleteTaskDoc,
  getDependentsList,
  disconnectDependentEdges,
  taskDeleteUpdateDirects,
};
