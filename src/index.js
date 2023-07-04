import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

axios.interceptors.request.use(function (config) {
  if (window.sessionStorage.getItem("key") !== null) {
    var data = window.sessionStorage.getItem("key");
    data = JSON.parse(data);
    const token = data.token;
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
  return config;
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
