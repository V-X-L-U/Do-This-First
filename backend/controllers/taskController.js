const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

const createTask = asyncHandler(async (req, res) => {
    const newTask = await new Task(req.body);

    await newTask.save().then((result) => {
        // 201 --> http create success status code
        res.status(201).json(result);
    }).catch((err) => {
        if (err.name == "ValidationError") {
            // 400 --> server won't/can't process request due to a perceived
            // client error
            res.status(400);
            throw new Error("Invalid payload for create task");
        }

        // 500 --> something went wrong server-side
        res.status(500);
        throw new Error("Server unable to create task");
    });
});
