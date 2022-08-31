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
  assertTaskEdges,
  assertDeleted,
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

  const markDoneRoute = (taskId) => `/api/tasks/markDone/${taskId}`;
  const markDoneCall = (taskData) => {
    return request(app)
      .put(markDoneRoute(taskData._id))
      .set("cookie", jwt)
      .send({});
  };

  const deleteRoute = (taskId) => `/api/tasks/delete/${taskId}`;
  const deleteCall = (taskData) =>
    request(app).delete(deleteRoute(taskData._id)).set("cookie", jwt).send({});

  it("Basic task delete", async () => {
    const [root, dep1] = await twoTaskSetup(jwt);

    const res1 = await deleteCall(root);
    expectStandardResponse(res1, 200, "Successfully deleted task", "");
    await assertDeleted(root);

    await assertRed(dep1);
    await assertTaskEdges(dep1, [], []);
  });

  it("Delete root from three tasks", async () => {
    const [root, dep1, dep2] = await threeTaskSetup(jwt);

    const res1 =  await deleteCall(root);
    expectStandardResponse(res1, 200, "Successfully deleted task", "");
    await assertDeleted(root);

    await assertRed(dep1);
    await assertGrey(dep2);

    await assertTaskEdges(dep1, [], [dep2._id]);
    await assertTaskEdges(dep2, [dep1._id], []);
  });

  it("Multiple delete", async () => {
    const [root, dep1, dep2] = await threeTaskSetup(jwt);

    const res1 = await markDoneCall(root);
    expectStandardResponse(res1, 200, "Successfully marked task done", "");

    const res2 = await markDoneCall(dep1);
    expectStandardResponse(res2, 200, "Successfully marked task done", "");

    const res3 = await deleteCall(root);
    expectStandardResponse(res3, 200, "Successfully deleted task", "");
    await assertDeleted(root);

    await assertStriked(dep1);
    await assertRed(dep2);

    await assertTaskEdges(dep1, [], [dep2._id]);
    await assertTaskEdges(dep2, [dep1._id], []);

    const res4 = await deleteCall(dep1);
    expectStandardResponse(res4, 200, "Successfully deleted task", "");
    await assertDeleted(dep1);

    await assertRed(dep2);

    await assertTaskEdges(dep2, [], []);
  });
});
