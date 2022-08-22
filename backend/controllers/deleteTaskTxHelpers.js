const Task = require("../models/taskModel");
const { produce500TxErr } = require("../utils");

// Return <True> iff. the transaction should abort as no task was deletd.
const deleteTaskDoc = async (session, txRes, taskId, userId) => {
  try {
    const deleteRes = await Task.deleteOne({
      _id: taskId,
      user_id: userId,
    }).session(session);
  } catch (err) {
    produce500TxErr(txRes, "Error deleting task", "delete task doc", err);
    return true;
  }

  if (deleteRes.deletedCount === 0) {
    txRes.status = 400;
    txRes.body = { message: "No task was deleted", server_err: "" };

    return true;
  }

  return false;
};

// Return the dependents list of task specified by <taskId> and <userId>.
// If task was not found, return null.
const getDependentsList = async (session, txRes, taskId, userId) => {
  try {
    const retrieveRes = await Task.findOne({
      _id: taskId,
      user_id: userId,
    }).session(session);
  } catch (err) {
    produce500TxErr(txRes, "Error deleting task", "get deps", err);
    return null;
  }

  if (!retrieveRes) {
    txRes.status = 400;
    txRes.body = { message: "No task was deleted", server_err: "" };

    return null;
  }

  return retrieveRes.dependents;
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
