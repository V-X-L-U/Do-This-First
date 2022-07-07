const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const {
  expectStandardResponse,
  setupTestServer,
  tearDownTestServer,
  authTokenName,
} = require("./test_helpers");

const credentials = {
  email: "auth_apitester@gmail.com",
  password: "auth_api_pass",
};

let server;
let userId;
let jwt;

beforeAll(async () => {
  const serverValues = await setupTestServer(credentials);
  server = serverValues.server;
  userId = serverValues.userId;
});

describe("API Basic Running Check", () => {
  it("Root URL sample test", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
  });
});

describe("Register Test Suite", () => {
  const registerRoute = "/api/auth/register";

  const newUser = { email: "newuser@gmail.com", password: "verynewish" };

  it("Successful Registration", async () => {
    const res = await request(app).post(registerRoute).send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email");
    expect(res.body.email).toEqual(newUser.email);
    expect(res.body).toHaveProperty("_id");
  });

  it("User Registered", async () => {
    // first creation should succeed
    const res = await request(app).post(registerRoute).send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("email");
    expect(res.body.email).toEqual(newUser.email);
    expect(res.body).toHaveProperty("_id");

    // second creation attempt should fail
    const res1 = await request(app).post(registerRoute).send(newUser);
    expectStandardResponse(res1, 400, "User already exists", "");
  });

  it("Invalid data", async () => {
    const invalidCredentials = {};
    const res = await request(app).post(registerRoute).send(invalidCredentials);

    expectStandardResponse(
      res,
      400,
      "Invalid data for a user",
      "ValidationError"
    );
  });

  // clean up the created user
  afterEach(async () => {
    const newTestUser = await User.findOne({ email: newUser.email });
    if (newTestUser) await User.deleteOne(newTestUser);
  });
});

describe("Login/Logout Test Suite", () => {
  const loginRoute = "/api/auth/login";

  it("Valid Login", async () => {
    const res = await request(app).post(loginRoute).send(credentials);
    expectStandardResponse(res, 200, "Logged in successfully", "");

    // set-cookie attribute is an array of strings, each representing a token
    // each token is of the form <cookie_name>=<cookie_value>; options...
    expect(res.headers["set-cookie"][0]).toEqual(
      expect.stringContaining(authTokenName)
    );
    jwt = res.headers["set-cookie"][0].split(";")[0];
  });

  it("Valid Login & Logout", async () => {
    const res = await request(app).post(loginRoute).send(credentials);
    expectStandardResponse(res, 200, "Logged in successfully", "");
    // set-cookie attribute is an array of strings, each representing a token
    // each token is of the form <cookie_name>=<cookie_value>; options...
    expect(res.headers["set-cookie"][0]).toEqual(
      expect.stringContaining(authTokenName)
    );

    // Logout the user
    // checks that the cookie is set to empty
    const emptyToken = `${authTokenName}=;`;
    const res1 = await request(app).post("/api/auth/logout").send({});
    expect(res1.headers["set-cookie"][0]).toEqual(
      expect.stringContaining(emptyToken)
    );
    expectStandardResponse(res1, 200, "Logged out successfully", "");
  });

  it("Invalid password", async () => {
    const invalidCredentials = {
      email: credentials.email,
      password: "invalidpass",
    };
    const res = await request(app).post(loginRoute).send(invalidCredentials);

    expectStandardResponse(res, 401, "Wrong password", "");
  });

  it("Non-existent user", async () => {
    const invalidCredentials = {
      email: "invalid.email@gmail.com",
      password: "invalidpass",
    };
    const res = await request(app).post(loginRoute).send(invalidCredentials);

    expectStandardResponse(res, 400, "User does not exist", "");
  });

  it("Invalid data", async () => {
    const invalidCredentials = {};
    const res = await request(app).post(loginRoute).send(invalidCredentials);

    expectStandardResponse(res, 400, "Invalid data for a user", "");
  });
});

afterAll(async () => {
  await tearDownTestServer(server, credentials);
});
