const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const authenticateUser = asyncHandler(async (req, res, next) => {
  const reqCookie = req.headers.cookie;

  if (!reqCookie) {
    res.status(401).json({ message: "User not authenticated", server_err: "" });
    return;
  }

  const tokenLabel = "do_this_first_auth_token=";
  let tokenValue;
  if (
    reqCookie &&
    reqCookie.includes(tokenLabel)
  ) {
    tokenValue = req.headers.cookie.split(tokenLabel)[1].split(";")[0];
  }

  try {
    const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);

    req.uid = decodedToken._id;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({message: "Invalid token", server_err: ""});
  }

});

module.exports = { authenticateUser };
