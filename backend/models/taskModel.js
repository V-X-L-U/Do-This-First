const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    prereqs_done: {
      type: Boolean,
      required: true,
    },
    task_done: {
      type: Boolean,
      required: true,
    },
    prereqs: {
      type: [String],
      required: true,
    },
    dependents: {
      type: [mongoose.ObjectId],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
