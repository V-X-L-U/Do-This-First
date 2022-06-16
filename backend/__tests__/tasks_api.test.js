const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const {
  loginUser,
  logoutUser,
  setupTestServer,
  tearDownTestServer,
  expectStandardResponse,
  expectUserNotAuthenticated,
  expectInvalidTokenErr,
  authTokenName,
} = require("./test_helpers");

const credentials = {
  email: "dothisfirst.tester@gmail.com",
  password: "dtf_testing",
};

let server;
let userId;
let jwt;

beforeAll(async () => {
  const serverValues = await setupTestServer(credentials);
  server = serverValues.server;
  userId = serverValues.userId;
});

describe("Create Task Test Suite", () => {
  const createTaskRoute = "/api/tasks/create";
  const sampleTask = {
    name: "new task name",
    description: "new task description",
    prereqs_done: false,
    task_done: false,
    prereqs: [],
  };

  it("Create Task Successfully", async () => {
    jwt = await loginUser(credentials);
    console.log(jwt);

    const res = await request(app)
      .post(createTaskRoute)
      .set("cookie", jwt)
      .send(sampleTask);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user_id");
    expect(res.body.user_id).toEqual(userId);
    expect(res.body).toHaveProperty("_id");
    // matches a subset of res.body
    expect(res.body).toMatchObject(sampleTask);
  });

  it("Failed without Authentication", async () => {
    // Notice we didn't set the cookie
    const res = await request(app).post(createTaskRoute).send(sampleTask);
    expectUserNotAuthenticated(res);
  });

  it("Failed with Invalid Token", async () => {
    // Notice we set an invalid jwt
    const invalidToken = `${authTokenName}=someinvalidjwt`;
    const res = await request(app)
      .post(createTaskRoute)
      .set("cookie", invalidToken)
      .send(sampleTask);
    expectInvalidTokenErr(res);
  });

  it("Failed Task Creation with Improper Body", async () => {
    jwt = await loginUser(credentials);

    const brokenTask = {
      description: "new task description",
      prereqs_done: false,
      task_done: false,
      prereqs: [],
    };

    const res = await request(app)
      .post(createTaskRoute)
      .set("cookie", jwt)
      .send(brokenTask);
    expectStandardResponse(
      res,
      400,
      "Invalid data for a task",
      "ValidationError"
    );
  });

  afterEach(logoutUser);
});

afterAll(async () => {
  await tearDownTestServer(server, credentials);
});
