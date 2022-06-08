import React, { useEffect, useState } from "react";
import { instance } from "./instance";
import "./App.css";

const App = () => {
  const [abc, setabc] = useState(0);
  const [def, setdef] = useState(0);
  const testCall = async () => {
    await instance
      .get("/")
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        console.log("[ERROR] Test call at / failed");
      });
  };

  useEffect(() => {
    testCall();
  });
  return <div>Do This First</div>;
};

export default App;
