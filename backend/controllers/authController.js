const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    console.log(userExists);
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const newUser = await new User(req.body);

  await newUser
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      console.log(err);
      if (err.name === "ValidationError") {
        res.status(400).json({ message: "Invalid data for a user" });
        return;
      }

      res.status(500).json({ message: "Error registering user"});
    });
});

module.exports = { registerUser };
