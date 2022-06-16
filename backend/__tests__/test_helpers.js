const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");

const credentials = {
  email: "dothisfirst.tester@gmail.com",
  password: "dtf_testing"
};

const authTokenName = "do_this_first_auth_token";

const expectStandardResponse = (
  res,
  expectedStatus,
  expectedMessage,
  expectedServerErr
) => {
  expect(res.statusCode).toEqual(expectedStatus);

  expect(res.body).toHaveProperty("message");
  expect(res.body.message).toEqual(expectedMessage);

  expect(res.body).toHaveProperty("server_err");
  expect(res.body.server_err).toEqual(expectedServerErr);
};

const expectUserNotAuthenticated = (res) => {
    expectStandardResponse(res, 401, "User not authenticated", "");
};

const setupTestServer = async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const server = app.listen();

  const res = await request(app).post("/api/auth/register").send(credentials);

  expect(res.statusCode).toEqual(201);
  expect(res.body.email).toEqual(credentials.email);

  const userId = res.body._id;

  return {
    server: server,
    userId: userId
  };
};

const tearDownTestServer = async (server) => {
  const testUser = await User.findOne({ email: credentials.email });
  await User.deleteOne(testUser);
  mongoose.connection.close();
  server.close();
}

const loginUser = async () => {
    const res = await request(app).post(loginRoute).send(credentials);
    expectStandardResponse(res, 200, "Logged in successfully", "");

    // set-cookie attribute is an array of strings, each representing a token
    // each token is of the form <cookie_name>=<cookie_value>; options...
    expect(res.headers["set-cookie"][0]).toEqual(
      expect.stringContaining(authTokenName)
    );

    return res.headers["set-cookie"][0].split(";")[0];
};

module.exports = { expectStandardResponse, expectUserNotAuthenticated, setupTestServer, tearDownTestServer, loginUser, authTokenName, credentials };