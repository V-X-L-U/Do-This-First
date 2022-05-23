const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// loads .env variables into process.env
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,DELETE,PUT",
  })
);
app.use(express.json()); // Allows us to accept JSON data in the body

app.get("/", (req, res) => {
  res.send("API is running...");
  console.log("API is running...");
});


let server;
if (process.env.NODE_ENV !== "test") {
  connectDB();
  server = app.listen(5000, console.log("Server running on port 5000"));
}

module.exports = { app, server };