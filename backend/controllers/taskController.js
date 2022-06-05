const asyncHandler = require("express-async-handler");

const getAllTasks = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Tasks found", server_err: ""});
});

module.exports = {
    getAllTasks
};