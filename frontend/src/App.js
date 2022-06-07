import React, { useEffect, useState } from "react";
import { instance } from "./instance";
import styles from "./App.module.css";

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

  const [counter, setCounter] = useState(0);

  const increase = () => {
    setCounter(counter + 1);
  };

  const decrease = () => {
    setCounter(counter - 1);
  };

  const reset = () => {
    setCounter(0);
  };

  return (
    <>
      <div className={styles.counter}>{counter}</div>
      <button className={styles.counter} onClick={increase}>
        +
      </button>
      <button className={styles.counter} onClick={decrease}>
        -
      </button>
      <button className={styles.counter} onClick={reset}>
        reset
      </button>
    </>
  );
};

export default App;
