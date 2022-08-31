const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const TxError = require("./txError");
const { runTxWithResults, checkValidObjectIds } = require("../utils");
const {
  getTaskById,
  taskDoneUpdateDirects,
  updateTaskHelper,
} = require("./markTaskDoneTxHelpers");

const makeSuccessTxRes = (txRes) => {
  (txRes.status = 200),
    (txRes.body = { message: "Successfully marked task done", server_err: "" });
};

const markTaskDone = asyncHandler(async (req, res) => {
  const markDoneId = req.params.id;
  const userId = req.uid;
  const txRes = {
    status: 400,
    body: {},
  };

  await mongoose.connection
    .transaction(async (session) => {
      const taskToMark = await getTaskById(session, markDoneId, userId, txRes);
      if (!taskToMark) {
        throw new TxError("Task not found");
      }

      if (taskToMark.task_done) {
        makeSuccessTxRes(txRes);
        throw new TxError("Task not done");
      }

      if (!taskToMark.prereqs_done) {
        txRes.status = 400;
        txRes.body = {
          message: "Some prerequisites are not yet done",
          server_err: "",
        };
        throw new TxError("Prereqs not done");
      }

      const markTaskFailed = await updateTaskHelper(
        session,
        markDoneId,
        userId,
        txRes
      );
      if (markTaskFailed) throw new TxError("Failed to mark task doc as done");

      const updateDirectsFailed = await taskDoneUpdateDirects(
        session,
        taskToMark.dependents,
        userId,
        txRes
      );
      if (updateDirectsFailed) throw new TxError("Failed to update dependents");

      makeSuccessTxRes(txRes);
    })
    .catch((err) => {
      if (err.name !== "TxError") {
        txRes.status = 500;
        txRes.body = {
          message: "Error marking task done",
          server_err: `[tx] ${err.toString()}`,
        };
      }
    });

  res.status(txRes.status).json(txRes.body);
});

module.exports = { markTaskDone };