const asyncHandler = require("express-async-handler");
const TestModel1 = require("../models/mongooseTestModel");

// POST /api/
const createData = asyncHandler(async (req, res) => {
    const data = await new TestModel1(req.body);

    await data
        .save()
        .then((result) => {
            res.status(201).json(result);
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400);
                throw new Error("Invalid create data input");
            }

            // otherwise unknown error
            res.status(500);
            throw new Error("Unable to create data");
        });
});

// GET /api/:id
const getDataById = asyncHandler(async (req, res) => {
  const dataId = req.params.id;

  await TestModel1.findOne({
    _id: taskId,
  })
    .then((docs) => {
      // if no matching document was found
      if (docs === null) {
        res.status(404);
        res.send({ message: "Unable to get data" });
        return;
      }
      res.status(200).json(docs);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400);
        throw new Error("Invalid id provided");
      }
      res.status(500);
      throw new Error("Unable to get a task");
    });
});

module.exports = {
  createData,
  getDataById,
}