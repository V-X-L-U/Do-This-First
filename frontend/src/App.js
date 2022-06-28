import { useEffect } from "react";
import { instance } from "./instance";
import LoginPage from "./pages/LoginPage";
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

  useEffect(() => {
    testCall();
  });
  return <LoginPage />;
};

export default App;
