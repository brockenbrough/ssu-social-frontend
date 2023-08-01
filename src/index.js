import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./components/comments/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
// Test Change

ReactDOM.render(
  // <React.StrictMode>
  
    <BrowserRouter>
    <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
  integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
  crossorigin="anonymous"
/>
      <App />
    </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);
