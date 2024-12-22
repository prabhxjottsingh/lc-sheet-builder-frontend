import React, { useEffect } from "react";
import AppRouter from "./router";
import "./styles/index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
};

export default App;
