const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const Task = require("../models/taskModel");

// Create a task through the corresponding API route.
// Relies on the create API being correct.
const createTask = async (jwt, taskData) => {
  const res = await request(app)
    .post("/api/tasks/create")
    .set("cookie", jwt)
    .send(taskData);
  expect(res.statusCode).toEqual(201);
  return res;
};

const twoTaskSetup = async (jwt) => {
  const root = {
    name: "root task",
    description: "sth",
    prereqs: [],
  };

  const rootRes = await createTask(jwt, root);

  const dep1 = {
    name: "dep 1",
    description: "sth",
    prereqs: [rootRes.body._id],
  };

  const dep1Res = await createTask(jwt, dep1);

  await assertRed(rootRes.body);
  await assertGrey(dep1Res.body);
  return [rootRes.body, dep1Res.body];
};

const threeTaskSetup = async (jwt) => {
  const [root, dep1] = await twoTaskSetup(jwt);
  const dep2 = {
    name: "dep 2",
    description: "sth",
    prereqs: [root._id, dep1._id],
  };

  const dep2Res = await createTask(jwt, dep2);

  await assertGrey(dep2Res.body);
  return [root, dep1, dep2Res.body];
};

// All tasks depend on the root and the root only.
const multLinearSetup = async (jwt) => {
  const [root, dep1] = await twoTaskSetup(jwt);
  const dep2 = {
    name: "dep 2",
    description: "sth",
    prereqs: [root._id],
  };

  const dep2Res = await createTask(jwt, dep2);

  const dep3 = {
    name: "dep 3",
    description: "sth",
    prereqs: [root._id],
  };

  const dep3Res = await createTask(jwt, dep3);

  await assertGrey(dep2Res.body);
  await assertGrey(dep3Res.body);
  return [root, dep1, dep2Res.body, dep3Res.body];
};

// A set up where dependents of a task have edges between each other.
const multNonLinearSetup = async (jwt) => {
  const [root, dep1, dep2] = await threeTaskSetup(jwt);

  const dep3 = {
    name: "dep 3",
    description: "sth",
    prereqs: [root._id, dep2._id],
  };

  const dep3Res = await createTask(jwt, dep3);

  await assertGrey(dep3Res.body);
  return [root, dep1, dep2Res.body, dep3Res.body];
};

const getTaskById = (taskData) => {
  return Task.findOne({ _id: taskData._id, user_id: taskData.user_id });
};

const assertGrey = async (taskData) => {
  const taskToAssert = await getTaskById(taskData);
  expect(taskToAssert.prereqs_done).toEqual(false);
  expect(taskToAssert.task_done).toEqual(false);
};

const assertRed = async (taskData) => {
  const taskToAssert = await getTaskById(taskData);
  expect(taskToAssert.prereqs_done).toEqual(true);
  expect(taskToAssert.task_done).toEqual(false);
};

const assertStriked = async (taskData) => {
  const taskToAssert = await getTaskById(taskData);
  expect(taskToAssert.prereqs_done).toEqual(true);
  expect(taskToAssert.task_done).toEqual(true);
};

module.exports = {
  createTask,
  twoTaskSetup,
  threeTaskSetup,
  multNonLinearSetup,
  multLinearSetup,
  assertGrey,
  assertRed,
  assertStriked,
};
