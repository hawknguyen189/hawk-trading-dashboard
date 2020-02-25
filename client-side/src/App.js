import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Mainpage from "./Components/Mainpage/Mainpage";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <div className="App wrapper">
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <Mainpage></Mainpage>
      <Footer></Footer>
    </div>
  );
}

export default App;
