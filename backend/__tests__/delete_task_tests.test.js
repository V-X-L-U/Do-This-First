const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const Task = require("../models/taskModel");

const {
  twoTaskSetup,
  threeTaskSetup,
  multLinearSetup,
  multNonLinearSetup,
  assertGrey,
  assertRed,
  assertStriked,
} = require("./mark_task_helpers");

const {
  loginUser,
  logoutUser,
  removeUser,
  registerUser,
  setupTestServer,
  tearDownTestServer,
  expectStandardResponse,
  expectUserNotAuthenticated,
  expectInvalidTokenErr,
} = require("./test_helpers");

const credentials = {
  email: "delete.task@gmail.com",
  password: "123456uU",
};

const otherCredentials = {
  email: "other.delete@gmail.com",
  password: "123456uU",
};

let server;
let userId;
let jwt;
let otherJwt;

beforeAll(async () => {
  const serverValues = await setupTestServer(credentials);
  server = serverValues.server;
  userId = serverValues.userId;

  await Task.deleteMany({});
  await registerUser(otherCredentials);
  otherJwt = await loginUser(otherCredentials);
});

afterAll(async () => {
  await removeUser(otherCredentials);
  await tearDownTestServer(server, credentials);
});

describe("Task Delete Test Suite", () => {
  beforeEach(async () => {
    jwt = await loginUser(credentials);
  });

  afterEach(async () => {
    await logoutUser(credentials);
    await Task.deleteMany({});
  });

  const deleteRoute = (taskId) => `/api/tasks/delete/${taskId}`;
  const deleteCall = (taskData) =>
    request(app).delete(deleteRoute(taskData._id)).set("cookie", jwt).send({});

  it("Basic task delete", async () => {
    const [root, dep1] = await twoTaskSetup(jwt);

    const res1 = await deleteCall(root);
    expectStandardResponse(res1, 200, "Successfully deleted task", "");

    await assertRed(dep1);
    await assertTaskEdges(dep1, [], []);
  });
});
