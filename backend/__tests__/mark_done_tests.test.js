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
  email: "mark.done@gmail.com",
  password: "123456uU",
};

const otherCredentials = {
  email: "other.user@gmail.com",
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

  it("Successful subsequent mark done", async () => {
    const [root, dep1, dep2] = await threeTaskSetup(jwt);

    const res1 = await markDoneCall(root);
    expectStandardResponse(res1, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertRed(dep1);
    assertGrey(dep2);

    const res2 = await markDoneCall(dep1);
    expectStandardResponse(res2, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertStriked(dep1);
    assertRed(dep2);

    const res3 = await markDoneCall(dep2);
    expectStandardResponse(res3, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertStriked(dep1);
    assertStriked(dep2);
  });

  it("Successfully update multiple prereqs", async () => {
    const [root, dep1, dep2, dep3] = await multLinearSetup(jwt);

    const res = await markDoneCall(root);
    expectStandardResponse(res, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertRed(dep1);
    assertRed(dep2);
    assertRed(dep3);
  });

  it("Mixed failed and successful mark done", async () => {
    const [root, dep1, dep2, dep3] = await multNonLinearSetup(jwt);

    const res1 = await markDoneCall(root);
    expectStandardResponse(res1, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertRed(dep1);
    assertGrey(dep2);
    assertGrey(dep3);

    // shouldn't change anything
    const res2 = await markDoneCall(dep3);
    expectStandardResponse(
      res2,
      400,
      "Some prerequisites are not yet done",
      ""
    );
    assertStriked(root);
    assertRed(dep1);
    assertGrey(dep2);
    assertGrey(dep3);

    const res3 = await markDoneCall(dep1);
    expectStandardResponse(res3, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertStriked(dep1);
    assertRed(dep2);
    assertGrey(dep3);

    const res4 = await markDoneCall(dep2);
    expectStandardResponse(res4, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertStriked(dep1);
    assertStriked(dep2);
    assertRed(dep3);

    const res5 = await markDoneCall(dep3);
    expectStandardResponse(res5, 200, "Successfully marked task done", "");
    assertStriked(root);
    assertStriked(dep1);
    assertStriked(dep2);
    assertStriked(dep3);
  });

  it("Marked done failed as prereqs are not done", async () => {
    const [root, dep1] = await twoTaskSetup(jwt);

    const res1 = await markDoneCall(dep1);
    expectStandardResponse(
      res1,
      400,
      "Some prerequisites are not yet done",
      ""
    );

    assertRed(root);
    assertGrey(dep1);
  });

  it("Marked done successfully since task already done", async () => {
    const [root, _] = await twoTaskSetup(jwt);

    const res1 = await markDoneCall(root);
    expectStandardResponse(res1, 200, "Successfully marked task done", "");

    const res2 = await markDoneCall(root);
    expectStandardResponse(res1, 200, "Successfully marked task done", "");
  });

  it("Mark done failed with non-existent task", async () => {
    const randomObjectId = "507f191e810c19729de860ea";

    const res1 = await request(app)
      .put(markDoneRoute(randomObjectId))
      .set("cookie", jwt)
      .send({});

    expectStandardResponse(res1, 400, "Task does not exist", "");
  });

  it("Mark done failed with task that user doesn't own", async () => {
    const [notOwned, _] = await twoTaskSetup(otherJwt); // doesn't belong to main test user

    const res1 = await request(app)
      .put(markDoneRoute(notOwned._id))
      .set("cookie", jwt)
      .send({});
    expectStandardResponse(res1, 400, "Task does not exist", "");
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

  it("Verify mark done doesn't update beyond relevant task forest", async () => {
    // Each task is part of a task forest that is in turn part of a user task
    // graph. This test checks that no updates are made beyond (1) the task
    // forest of which the task marked done is a part of and (2) the user's task
    // graph (i.e., other people's task).
    const [root, dep1, dep2] = await threeTaskSetup(jwt);
    const [disRoot, disDep1] = await twoTaskSetup(jwt);
    const [otherRoot, otherDep1] = await twoTaskSetup(otherJwt);

    const res = await markDoneCall(root);
    assertStriked(root);
    assertRed(dep1);
    assertGrey(dep2);

    assertRed(disRoot);
    assertGrey(disDep1);

    assertRed(otherRoot);
    assertGrey(otherDep1);
  });
});