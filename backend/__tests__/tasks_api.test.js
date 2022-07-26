const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const Task = require("../models/taskModel");

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
    prereqs: [],
  };

  it("Create Task Successfully", async () => {
    jwt = await loginUser(credentials);

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
    expect(res.body).toHaveProperty("prereqs_done");
    expect(res.body.prereqs_done).toEqual(true);
    expect(res.body).toHaveProperty("task_done");
    expect(res.body.task_done).toEqual(false);
    expect(res.body).toHaveProperty("dependents");
    expect(res.body.dependents).toHaveLength(0);

    const dependentTask = {
      name: "dependent 1",
      description: "This is a dependent of another task",
      prereqs: [res.body._id],
    };
    const res = await request(app)
      .post(createTaskRoute)
      .set("cookie", jwt)
      .send(dependentTask);

    expect(res1.statusCode).toEqual(201);
    expect(res1.body).toHaveProperty("user_id");
    expect(res1.body.user_id).toEqual(userId);
    expect(res1.body).toHaveProperty("_id");
    expect(res1.body).toMatchObject(dependentTask);
    expect(res1.body).toHaveProperty("prereqs_done");
    expect(res1.body.prereqs_done).toEqual(false);
    expect(res1.body).toHaveProperty("task_done");
    expect(res1.body.task_done).toEqual(false);
    expect(res1.body).toHaveProperty("dependents");
    expect(res1.body.dependents).toHaveLength(0);

    try {
      const rootTask = await Task.findOne({ _id: res.body._id });
      console.log(rootTask);
      // sampleTask should now have dependentTask as a dependent
      expect(rootTask.dependents).toEqual([res1.body._id]);
    } catch (err) {
      console.log(err);
      fail("[Create Task Successfully] Unexpected error occurred");
    }
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

describe("Get All Tasks Test Suite", () => {
  beforeAll(async () => {
    await Task.deleteMany({ user_id: userId });
  });

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
        .post("/api/tasks/create")
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
      .get(allTasksRoute)
      .set("cookie", jwt)
      .send({});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("tasks");
    expect(res.body.tasks).toHaveLength(3);

    res.body.tasks.forEach((task) => {
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
    // Notice we didn't set the cookie
    const res = await request(app).get(allTasksRoute).send(taskData);
    expectUserNotAuthenticated(res);
  });

  it("Failed with Invalid Token", async () => {
    // Notice we set an invalid jwt
    const invalidToken = `${authTokenName}=someinvalidjwt`;
    const res = await request(app)
      .get(allTasksRoute)
      .set("cookie", invalidToken)
      .send(taskData);
    expectInvalidTokenErr(res);
  });
});

afterAll(async () => {
  await tearDownTestServer(server, credentials);
});
