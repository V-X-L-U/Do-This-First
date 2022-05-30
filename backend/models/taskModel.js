const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        prereqsDone: {
            type: Boolean,
            required: true,
        },
        taskDone: {
            type: Boolean,
            required: true,
        },
        prerequisites: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;