import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Mainpage from "./Components/Mainpage/Mainpage";
import Footer from "./Components/Footer/Footer";
import Dashboard1 from "./Components/Dashboard/Dashboard1";

function App() {
  return (
    <div className="App wrapper">
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <Dashboard1></Dashboard1>
      <Footer></Footer>
    </div>
  );
}

export default App;
