const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const {
  loginUser,
  setupTestServer,
  tearDownTestServer,
  expectStandardResponse
} = require("./test_helpers");

let server;
let userId;
let jwt;

beforeAll(async () => {
  const serverValues = await setupTestServer();
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
    prereqs: []
  };

  it("Create Task Successfully", async () => {
    jwt = await loginUser();

    const res = await request(app).post(createTaskRoute).send(sampleTask);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user_id");
    expect(res.body.user_id).toEqual(userId);
    expect(res.body).toHaveProperty("_id");
    // matches a subset of res.body
    expect(res.body).toMatchObject(sampleTask);
  });

  it("Failed Task Creation without Authentication", async () => {
    // Notice there is no login
    const res = await request(app).post(createTaskRoute).send(sampleTask);
    expectUserNotAuthenticated(res);
  });

  // TODO : Ideally check for invalid tokens

  it("Failed Task Creation with Improper Body", async () => {
    const brokenTask = {
      description: "new task description",
      prereqs_done: false,
      task_done: false,
      prereqs: []
    };

    const res = await request(app).post(createTaskRoute).send(brokenTask);
    expectStandardResponse(
      res,
      400,
      "Invalid data for a task",
      "ValidationError"
    );
  });
});

afterAll(async () => {
  await tearDownTestServer(server);
});