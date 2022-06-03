const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // if the doc exists, `userExists` will be the document instance
  // o/w, it will be null
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400).json({ message: "User already exists", server_err: "" });
    return;
  }

  const newUser = await new User(req.body);

  await newUser
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .json({ message: "Invalid data for a user", server_err: err.name });
        return;
      }

      res
        .status(500)
        .json({ message: "Error registering user", server_err: err.name });
    });
});

module.exports = { registerUser };
