import React from "react";
import ReactDOM from "react-dom";
import CoreLayout from "./common/layouts/CoreLayout";
import "./styles/_main.scss";
import { BrowserRouter as Router } from "react-router-dom";
import Discover from "./routes/Discover/components/Discover";

ReactDOM.render(
  <React.StrictMode>
    <CoreLayout>
      <Router>
        <Discover />
      </Router>
    </CoreLayout>
  </React.StrictMode>,
  document.getElementById("root")
);
