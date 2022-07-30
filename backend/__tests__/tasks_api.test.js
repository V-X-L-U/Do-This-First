const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const Task = require("../models/taskModel");

const {
  registerUser,
  removeUser,
  loginUser,
  logoutUser,
  setupTestServer,
  tearDownTestServer,
  expectStandardResponse,
  expectUserNotAuthenticated,
  expectInvalidTokenErr,
  authTokenName,
} = require("./test_helpers");

const assertTaskDetails = (
  taskRequest,
  task_doc,
  userId,
  dependents,
  prereqs_done,
  task_done
) => {
  expect(task_doc).toHaveProperty("user_id");
  expect(task_doc.user_id).toEqual(userId);
  expect(task_doc).toHaveProperty("_id");
  expect(task_doc).toHaveProperty("prereqs_done");
  expect(task_doc.prereqs_done).toEqual(prereqs_done);
  expect(task_doc).toHaveProperty("task_done");
  expect(task_doc.task_done).toEqual(task_done);
  expect(task_doc).toHaveProperty("dependents");
  expect(task_doc.dependents).toEqual(dependents);
  // matches a subset of res.body
  expect(task_doc).toMatchObject(taskRequest);
};

const credentials = {
  email: "valen.ko@gmail.com",
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

describe("Create Task Test Suite", () => {
  const createTaskRoute = "/api/tasks/create";
  const sampleTask = {
    name: "new task name",
    description: "new task description",
    prereqs: [],
  };
  const createCall = (jwt, taskData) => {
    return request(app).post(createTaskRoute).set("cookie", jwt).send(taskData);
  };

  it("Create Task Successfully", async () => {
    jwt = await loginUser(credentials);

    const res = await createCall(jwt, sampleTask);

    expect(res.statusCode).toEqual(201);
    assertTaskDetails(sampleTask, res.body, userId, [], true, false);

    const dependentTask = {
      name: "dependent 1",
      description: "This is a dependent of another task",
      prereqs: [res.body._id],
    };

    const res1 = await createCall(jwt, dependentTask);
    expect(res1.statusCode).toEqual(201);
    assertTaskDetails(dependentTask, res1.body, userId, [], false, false);

    const rootTask = await Task.findOne({ _id: res.body._id });
    // sampleTask should now have dependentTask as a dependent
    expect(rootTask.dependents).toEqual([res1.body._id]);

    const depTask = await Task.findOne({ _id: res1.body._id });
    expect(depTask.dependents).toEqual([]);

    const dependentTask1 = {
      name: "dependent 2",
      description: "This is another dependent",
      prereqs: [res.body._id, res1.body._id],
    };
    const res2 = await createCall(jwt, dependentTask1);
    expect(res2.statusCode).toEqual(201);
    assertTaskDetails(dependentTask1, res2.body, userId, [], false, false);

    const rootTask_ = await Task.findOne({ _id: res.body._id });
    // sampleTask should now have the following dependents:
    // - dependentTask
    // - dependentTask1
    expect(rootTask_.dependents).toEqual([res1.body._id, res2.body._id]);

    const depTask_ = await Task.findOne({ _id: res1.body._id });
    // dependentTask should have dependentTask2 as the only dependent
    expect(depTask_.dependents).toEqual([res2.body._id]);

    const dep1Task = await Task.findOne({ _id: res2.body._id });
    // dependentTask1 should have no dependents
    expect(dep1Task.dependents).toEqual([]);
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
      prereqs: [],
    };

    const res = await createCall(jwt, brokenTask);
    expectStandardResponse(
      res,
      400,
      "Invalid data for a task",
      "ValidationError"
    );
  });

  it("Failed Task creating with missing prereqs in req", async () => {
    jwt = await loginUser(credentials);

    // no prereqs field
    const brokenTask = {
      name: "sth",
      description: "idk",
    };

    const res = await createCall(jwt, brokenTask);
    expectStandardResponse(res, 400, "Invalid data for a task", "");
  });

  it("Failed with not owned prereq", async () => {
    // create a task for user 1
    jwt = await loginUser(credentials);
    const notOwned = await createCall(jwt, sampleTask);

    // create another user with a task that attempts to use
    // user 1's task as a prereq
    const newUserCredentials = {
      email: "ming@gmail.com",
      password: "132435yY",
    };
    await registerUser(newUserCredentials);
    jwt2 = await loginUser(newUserCredentials);

    const brokenTask = {
      name: "another broken one",
      description: "the prereq is not owned by this user",
      prereqs: [notOwned.body._id],
    };
    const res = await createCall(jwt2, brokenTask);
    expectStandardResponse(res, 400, "Some prerequisites do not exist", "");

    await removeUser(newUserCredentials);
  });

  it("Failed with invalid prereq id", async () => {
    jwt = await loginUser(credentials);
    const brokenTask = {
      name: "broken",
      description: "invalid prereq id",
      prereqs: ["a"],
    };

    const res = await createCall(jwt, brokenTask);
    expectStandardResponse(res, 400, "Some prerequisites do not exist", "");
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
      assertTaskDetails(task, res.body, userId, [], true, false);

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
