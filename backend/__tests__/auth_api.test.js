const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");

const credentials = {
  email: "dothisfirst.tester@gmail.com",
  password: "dtf_testing"
};

const authTokenName = "do_this_first_auth_token";
let server;
let userId;
let jwt;

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

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  server = app.listen();

  const res = await request(app).post("/api/auth/register").send(credentials);

  expect(res.statusCode).toEqual(201);
  expect(res.body.email).toEqual(credentials.email);

  userId = res.body._id;
});

describe("API Basic Running Check", () => {
  it("Root URL sample test", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
  });
});

describe("Login Test Suite", () => {
  const loginRoute = "/api/auth/login";

  it("Valid Login", async () => {
    const res = await request(app).post(loginRoute).send(credentials);
    expect(res.statusCode).toEqual(200);

    // set-cookie attribute is an array of strings, each representing a token
    // each token is of the form <cookie_name>=<cookie_value>; options...
    expect(res.headers["set-cookie"][0]).toEqual(
      expect.stringContaining(authTokenName)
    );
    jwt = res.headers["set-cookie"][0].split(";")[0];
  });

  it("Invalid password", async () => {
    const invalidCredentials = {
      email: credentials.email,
      password: "invalidpass"
    };
    const res = await request(app).post(loginRoute).send(invalidCredentials);

    expectStandardResponse(res, 401, "Wrong password", "");
  });

  it("Non-existent user", async () => {
    const invalidCredentials = {
      email: "invalid.email@gmail.com",
      password: "invalidpass"
    };
    const res = await request(app).post(loginRoute).send(invalidCredentials);

    expectStandardResponse(res, 400, "User does not exist", "");
  });
});

afterAll(async () => {
  const testUser = await User.findOne({ email: credentials.email });
  await User.deleteOne(testUser);
  mongoose.connection.close();
  server.close();
});
