import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import ControlSidebar from "./Components/Sidebar/ControlSidebar";
import Mainpage from "./Components/Mainpage/Mainpage";
import Footer from "./Components/Footer/Footer";
import Dashboard1 from "./Components/Dashboard/Dashboard1";
import Dashboard2 from "./Components/Dashboard/Dashboard2";
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
          <Route path="/defaultpage" component={Mainpage}></Route>
        </Switch>
        <Route path="/" component={Footer}></Route>
        <Route path="/" component={ControlSidebar}></Route>
      </div>
    </Router>
  );
}

export default App;
