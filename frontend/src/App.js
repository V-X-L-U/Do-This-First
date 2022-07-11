import { useState } from "react";
import { instance } from "./instance";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationModal from "./pages/RegistrationModal/RegistrationModal";
import TaskListPage from "./pages/TaskListPage/TaskListPage";

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

  const createTask = async () => {
    const newTask = {
      name: "Groceries",
      description: "Buy meat at TnT",
      prereqs_done: false,
      task_done: false,
      prereqs: [],
    };

    await instance
      .post("/api/tasks/create", newTask)
      .then((res) => {
        setMessageDisplay("Task Successfully created");
        console.log(res.data);
      })
      .catch(errHandler);
  };

  const getAllTasks = async () => {
    try {
      const res = await instance.get("api/tasks/getAll");
      console.log(res);
    } catch (err) {
      errHandler(err);
    }
  };

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegistrationModal />} />
      <Route path="tasks" element={<TaskListPage />} />
    </Routes>
  </BrowserRouter>;

  return (
    <div>
      <div>DoThisFirst</div>
      <button onClick={registerUser}>Create User</button>
      <button onClick={loginUser}>Login User</button>
      <button onClick={logoutUser}>Logout User</button>
      <button onClick={getTasks}>Get Tasks</button>
      <button onClick={createTask}>Create Task</button>
      <button onClick={getAllTasks}>Get All Tasks</button>
      <div>{messageDisplay}</div>
    </div>
  );
};

export default App;
