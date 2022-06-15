import React, { useEffect, useState } from "react";
import { instance } from "./instance";
import "./App.css";

const App = () => {
  const [messageDisplay, setMessageDisplay] = useState("");

  const userData = {
    email: "valen.ko@gmail.com",
    password: "vakovkorvalen",
  };

  const errHandler = (err) => {
    console.log(err.response.data);
    setMessageDisplay(err.response.data.message);
  };

  const registerUser = async () => {
    await instance
      .post("/api/auth/register", userData)
      .then((res) => {
        console.log(res.data);
        setMessageDisplay("User successfully created");
      })
      .catch(errHandler);
  };

  const loginUser = async () => {
    await instance
      .post("/api/auth/login", userData)
      .then((res) => {
        console.log(res.data);
        setMessageDisplay("User logged in successfully");
      })
      .catch(errHandler);
  };

  const logoutUser = async () => {
    await instance
      .post("/api/auth/logout", {})
      .then((res) => {
        console.log(res.data);
        setMessageDisplay("User successfully logged out");
      })
      .catch(errHandler);
  };

  const getTasks = async () => {
    await instance
      .get("/api/tasks/all")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div>DoThisFirst</div>
      <button onClick={registerUser}>Create User</button>
      <button onClick={loginUser}>Login User</button>
      <button onClick={logoutUser}>Logout User</button>
      <button onClick={getTasks}>Get Tasks</button>
      <div>{messageDisplay}</div>
    </div>
  );
};

export default App;
