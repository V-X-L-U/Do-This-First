const {
  deleteTaskDoc,
  getDependentsList,
  disconnectDependentEdges,
  taskDeleteUpdateDirects,
} = require("./deleteTaskTxHelpers");
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

// Run a transaction to delete the task specified by <taskId> and <userId>.
const deleteTaskTx = (txRes, taskId, userId) => {
  return mongoose.connection.transaction(async (session) => {
    // Retrieve dependents list
    const dependentsList = getDependentsList(session, txRes, taskId, userId);
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

    // Update dependent
    //   - Update `prereqs_done` if not `prereqs_done`
    if (await taskDeleteUpdateDirects(session, txRes, dependentsList, userId))
      throw new TxError("Failed to update direct dependents");

    txRes.status = 200;
    txRes.body = { message: "Successfully deleted task", server_err: "" };
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
