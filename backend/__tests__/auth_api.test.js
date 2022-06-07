const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");

const User = require("../models/userModel");

let credentials = {
  email: "dothisfirst.tester@gmail.com",
  password: "dtf_testing"
};

let server;
let userId;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  server = app.listen();

  const res = await request(app).post("/api/auth/register").send(credentials);

  expect(res.statusCode).toEqual(201);
  expect(res.body.email).toEqual(credentials.email);

  userId = res.body._id;
});

describe("API Basic Running Check", () => {
    it("Root URL sample test", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(200);
    });
});

afterAll(async () => {
    const testUser = await User.findOne({ email: credentials.email });
    await User.deleteOne(testUser);
    mongoose.connection.close();
    server.close();
});