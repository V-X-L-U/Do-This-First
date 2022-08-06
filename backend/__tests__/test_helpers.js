const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");

const authTokenName = "do_this_first_auth_token";

const expectStandardResponse = (
  res,
  expectedStatus,
  expectedMessage,
  expectedServerErr
) => {
  if (res.statusCode !== expectedStatus) console.log(res);
  expect(res.statusCode).toEqual(expectedStatus);

  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual(expectedMessage);

  expect(res.body).toHaveProperty("server_err");
  expect(res.body.server_err).toEqual(expectedServerErr);
};

const expectUserNotAuthenticated = (res) => {
  expectStandardResponse(res, 401, "User not authenticated", "");
};

const expectInvalidTokenErr = (res) => {
  expectStandardResponse(res, 401, "Invalid token", "");
};

const setupTestServer = async (credentials) => {
  await mongoose.connect(
    "mongodb://LAPTOP-I39IOSMN:27017,LAPTOP-I39IOSMN:27018,LAPTOP-I39IOSMN:27019?replicaSet=rs",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );

  const server = app.listen();

  // make sure user doesn't exist
  const testUser = await User.findOne({ email: credentials.email });
  if (testUser) await User.deleteOne(testUser);

  const res = await request(app).post("/api/auth/register").send(credentials);

  expect(res.statusCode).toEqual(201);
  expect(res.body.email).toEqual(credentials.email);

  const userId = res.body._id;

  return {
    server: server,
    userId: userId,
  };
};

const tearDownTestServer = async (server, credentials) => {
  const testUser = await User.findOne({ email: credentials.email });
  if (testUser) await User.deleteOne(testUser);
  mongoose.connection.close();
  server.close();
};

const registerUser = async (credentials) => {
  const newUser = await request(app)
    .post("/api/auth/register")
    .send(credentials);
  expect(newUser.statusCode).toEqual(201);
  expect(newUser.body.email).toEqual(credentials.email);
};

const removeUser = async (credentials) => {
  const userToRemove = await User.findOne({ email: credentials.email });
  if (userToRemove) await User.deleteOne(userToRemove);
};

const loginUser = async (credentials) => {
  const loginRoute = "/api/auth/login";
  const res = await request(app).post(loginRoute).send(credentials);
  expectStandardResponse(res, 200, "Logged in successfully", "");

  // set-cookie attribute is an array of strings, each representing a token
  // each token is of the form <cookie_name>=<cookie_value>; options...
  expect(res.headers["set-cookie"][0]).toEqual(
    expect.stringContaining(authTokenName)
  );

  return res.headers["set-cookie"][0].split(";")[0];
};

const logoutUser = async () => {
  // Logout the user
  // checks that the cookie is set to empty
  const emptyToken = `${authTokenName}=;`;
  const res1 = await request(app).post("/api/auth/logout").send({});
  expect(res1.headers["set-cookie"][0]).toEqual(
    expect.stringContaining(emptyToken)
  );
  expectStandardResponse(res1, 200, "Logged out successfully", "");
};

const oidToString = (oidList) => {
  const converted = [];
  oidList.forEach((oid) => {
    converted.push(oid.toString());
  });
  return converted;
};

module.exports = {
  expectStandardResponse,
  expectUserNotAuthenticated,
  expectInvalidTokenErr,
  setupTestServer,
  tearDownTestServer,
  registerUser,
  removeUser,
  loginUser,
  logoutUser,
  oidToString,
  authTokenName,
};
