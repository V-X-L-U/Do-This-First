const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const { runTxWithResults, checkValidObjectIds } = require("utils");
const {
  getTaskById,
  taskDoneUpdateDirects,
} = require("./markTaskDoneTxHelpers");

const markTaskDone = asyncHandler(async (req, res) => {
  const markDoneId = req.params.id;
  const session = await Task.startSession();
  const txRes = await runTxWithResults(session, async () => {
    const txRes_ = {
      status: 400,
      body: {},
    };
    const taskToMark = await getTaskById(session, markDoneId, req.uid, txRes_);
    if (!taskToMark)
      // if null
      return txRes_;

    if (taskToMark.task_done)
      return {
        status: 200,
        body: {
          message: "Successfully marked task done",
          server_err: "",
        },
      };

    // if prereqs not done, abort
    if (!taskToMark.prereqs_done) {
      return {
        status: 400,
        body: {
          message: "Some prerequisites are not yet done",
          server_err: "",
        },
      };
    }

    // otherwise, mark task done and update DIRECT dependents
    await taskDoneUpdateDirects(
      session,
      taskToMark.dependents,
      req.uid,
      txRes_
    );

    return txRes_;
  });

  res.status(txRes.status).json(txRes.body);
  await session.endSession();
});

module.exports = { markTaskDone };