import React from "react";
import ReactDOM from "react-dom";
import "./index.module.scss";
import App from "./pages/app";

require("dotenv").config();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
