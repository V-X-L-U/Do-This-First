const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
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

const authTokenName = "do_this_first_auth_token";

const loginUser = asyncHandler(async (req, res) => {
  if (
    !req.body.hasOwnProperty("email") ||
    !req.body.hasOwnProperty("password")
  ) {
    res
      .status(400)
      .json({ message: "Invalid data for a user", server_err: "" });
    return;
  }

  const userData = await User.findOne({ email: req.body.email });
  if (!userData) {
    res.status(400).json({ message: "User does not exist", server_err: "" });
    return;
  }

  const passwordMatched = await bcrypt.compare(
    req.body.password,
    userData.password
  );
  if (!passwordMatched) {
    res.status(401).json({ message: "Wrong password", server_err: "" });
    return;
  }

  const token = jwt.sign(
    {
      email: userData.email,
      _id: userData._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5h",
    }
  );

  const options = {
    maxAge: 5 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  };

  res.cookie(authTokenName, token, options);
  res.status(200).json({ message: "Logged in successfully", server_err: "" });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie(authTokenName);
  res.status(200).json({
    message: "Logged out successfully",
    server_err: "",
  });
});

module.exports = { registerUser, loginUser, logoutUser };
