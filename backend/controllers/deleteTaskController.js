const {
  deleteTaskDoc,
  getDependentsList,
  disconnectDependentEdges,
  taskDeleteUpdateDirects,
} = require("./deleteTaskTxHelpers");
const { produce500TxErr } = require("../utils");
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const mongoose = require("mongoose");
const TxError = require("./txError");

// Run a transaction to delete the task specified by <taskId> and <userId>.
const deleteTaskTx = (txRes, taskId, userId) => {
  return mongoose.connection
    .transaction(async (session) => {
      // Retrieve dependents list
      const dependentsList = await getDependentsList(
        session,
        txRes,
        taskId,
        userId
      );
      if (dependentsList === null) throw new TxError("Task not found");

      // Delete the task document
      if (await deleteTaskDoc(session, txRes, taskId, userId))
        throw new TxError("No task deleted");

      // Disconnect edges
      if (
        await disconnectDependentEdges(
          session,
          txRes,
          dependentsList,
          taskId,
          userId
        )
      )
        throw new TxError("Failed to disconnect edges");

      if (await taskDeleteUpdateDirects(session, txRes, dependentsList, userId))
        throw new TxError("Failed to update direct dependents");

      txRes.status = 200;
      txRes.body = { message: "Successfully deleted task", server_err: "" };
    })
    .catch((err) => {
      if (err.name !== "TxError")
        produce500TxErr(txRes, "Error deleting task", "tx", err);
    });
};

const deleteTask = asyncHandler(async (req, res) => {
  const deleteId = req.params.id;
  const userId = req.uid;
  const txRes = {
    status: 400,
    body: {},
  };

  await deleteTaskTx(txRes, deleteId, userId);

  res.status(txRes.status).json(txRes.body);
});

module.exports = { deleteTask };
