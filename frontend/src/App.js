import React, { useState } from "react";
import { instance } from "./instance";
import "./App.css";

const App = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const userData = {
    email: "valen.ko@gmail.com",
    password: "vakovkorvalen",
  };

  const testCall = async () => {
    await instance
      .post("/api/auth/register", userData)
      .then((res) => {
        console.log(res.data);
        setErrorMessage("User successfully created");
      })
      .catch((err) => {
        console.log(err.response.data);
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <div>
      <div>DoThisFirst</div>
      <button onClick={testCall}>Create User</button>
      <div>{errorMessage}</div>
    </div>
  );
};

export default App;
