import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Containers/Navbar/Navbar";
import Sidebar from "./Containers/Sidebar/Sidebar";
import ControlSidebar from "./Containers/Sidebar/ControlSidebar";
import Mainpage from "./Containers/Mainpage/Mainpage";
import Footer from "./Containers/Footer/Footer";
import Dashboard1 from "./Containers/Dashboard/Dashboard1";
import Dashboard2 from "./Containers/Dashboard/Dashboard2";
import Dashboard3 from "./Containers/Dashboard/Dashboard3";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App wrapper">
        <Route path="/" component={Navbar}></Route>
        <Route path="/" component={Sidebar}></Route>
        <Switch>
          <Route path="/dashboard1" component={Dashboard1}></Route>
          <Route path="/Dashboard2" component={Dashboard2}></Route>
          <Route path="/Dashboard3" component={Dashboard3}></Route>
          <Route path="/defaultpage" component={Mainpage}></Route>
        </Switch>
        <Route path="/" component={Footer}></Route>
        <Route path="/" component={ControlSidebar}></Route>
      </div>
    </Router>
  );
}

export default App;
