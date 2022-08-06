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
  setupTestServer,
  tearDownTestServer,
  expectStandardResponse,
  expectUserNotAuthenticated,
  expectInvalidTokenErr,
} = require("./test_helpers");

const credentials = {
  email: "mark.done@gmail.com",
  password: "123456uU",
};

let server;
let userId;
let jwt;

beforeAll(async () => {
  const serverValues = await setupTestServer(credentials);
  server = serverValues.server;
  userId = serverValues.userId;
});

afterAll(async () => {
  await tearDownTestServer(server, credentials);
});

describe("Task Mark Done Test Suite", () => {
  beforeEach(async () => {
    jwt = await loginUser(credentials);
  });

  afterEach(async () => {
    await logoutUser(credentials);
    await Task.deleteMany({});
  });
  const markDoneRoute = (taskId) => `/api/tasks/markDone/${taskId}`;
  const markDoneCall = (taskData) => {
    return request(app)
      .put(markDoneRoute(taskData._id))
      .set("cookie", jwt)
      .send({});
  };

  it("Basic mark done", async () => {
    const [root, dep1] = await twoTaskSetup(jwt);
    await assertRed(root);
    await assertGrey(dep1);

    const res1 = await markDoneCall(root);
    expectStandardResponse(res1, 200, "Successfully marked task done", "");

    await assertStriked(root);
    await assertRed(dep1);

    const res2 = await markDoneCall(dep1);
    expectStandardResponse(res2, 200, "Successfully marked task done", "");

    await assertStriked(root);
    await assertStriked(dep1);
  });

  it("Mark done failed with invalid task id", async () => {
    const res1 = await request(app)
      .put("/api/tasks/markDone/invalidId")
      .set("cookie", jwt)
      .send({});

    expectStandardResponse(
      res1,
      400,
      "Task does not exist",
      "Invalid ObjectId"
    );
  });
});
