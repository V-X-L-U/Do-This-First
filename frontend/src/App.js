import { useEffect } from "react";
import { instance } from "./instance";
import "./App.css";

const App = () => {
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

  const createDataCall = async () => {
    await instance
      .post("/api/", { name: "some_name", rating: 10 })
      .then((res) => {
        console.log(`Response: ${res.data}`);
      })
      .catch((e) => {
        console.log(e);
        console.log("error");
      });
  };

  const getDataCall = async () => {};

  useEffect(() => {
    testCall();
  });

  return (
    <div>
      <div>DoThisFirst</div>
      <button onClick={createDataCall}>Create</button>
      <button onClick={getDataCall}>Get</button>
    </div>
  );
};

export default App;
