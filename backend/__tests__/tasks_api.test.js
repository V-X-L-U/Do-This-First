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
  testInvalidToken,
  testNotAuthenticated,
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
    await testNotAuthenticated(createTaskRoute, sampleTask);
  });

  it("Failed with Invalid Token", async () => {
    await testInvalidToken(createTaskRoute, sampleTask);
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

describe("Get All Tasks Test Suite", () => {
  const allTasksRoute = "/api/tasks/getAll";

  // names will be added later
  const sampleTask = {
    description: "new task description",
    prereqs_done: false,
    task_done: false,
    prereqs: [],
  };

  const taskData = {
    ...sampleTask,
    name: "sample task name",
  };

  const createTasks = async (token) => {
    const taskIds = [];
    for (let i = 0; i < 3; i++) {
      const task = { ...sampleTask };
      task.name = `task${i}`;
      const res = await request(app)
        .post(createTaskRoute)
        .set("cookie", token)
        .send(task);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("user_id");
      expect(res.body.user_id).toEqual(userId);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toMatchObject(task);

      taskIds.push(res.body._id);
    }

    return taskIds;
  };

  it("Successfully get all tasks", async () => {
    jwt = await loginUser(credentials);
    const taskIds = await createTasks(jwt);

    const res = await request(app)
      .post(allTasksRoute)
      .set("cookie", jwt)
      .send({});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("tasks");
    expect(res.body.tasks).toHaveLength(3);

    res.body.tasks.array.forEach((task) => {
      expect(task).toHaveProperty("user_id");
      expect(task.user_id).toEqual(userId);
      expect(task).toHaveProperty("_id");
      expect(taskIds).toContain(task._id);

      expect(task).toHaveProperty("name");
      expect(["task0", "task1", "task2"]).toContain(task.name);
      expect(task).toMatchObject(sampleTask);
    });
  });

  it("Failed without Authentication", async () => {
    testNotAuthenticated(allTasksRoute, taskData);
  });

  it("Failed with Invalid Token", async () => {
    testInvalidToken(allTasksRoute, taskData);
  });
});

afterAll(async () => {
  await tearDownTestServer(server, credentials);
});
