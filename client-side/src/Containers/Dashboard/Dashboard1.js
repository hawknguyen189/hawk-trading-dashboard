import React, { useEffect } from "react";
// import DrawingChartJS from "../Utils/DashboardDrawing/DrawingChartJS";
// import Dashboard1Data from "./Data/Dashboard1Data";
import ConnectPanel from "../../Conponents/ConnectBinance/ConnectPanel";
import MainSection from "../../Conponents/ConnectBinance/MainSection";
import OmniBot from "../../Conponents/ConnectBinance/OmniBot";

const Dashboard1 = () => {
  useEffect(() => {
    const callKlineData = async () => {
      const endpoint = "callklinedata";
      try {
        let response = await fetch(`/${endpoint}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const jsonResponse = await response.json();
          // const resultParse = JSON.parse(jsonResponse);
          
          console.log("kline ", jsonResponse);
        }
      } catch (e) {
        console.log("calling account balance error ", e);
      }
    };
    callKlineData();
  }, []);
  return (
    // {/* Content Wrapper. Contains page content */}
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Dashboard</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard v1</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* Small boxes (Stat box) */}
          <div className="row">
            {/* small box */}
            <OmniBot
              botName="Hawk"
              stylist="small-box bg-info"
              strategy="Keltner Channels"
            ></OmniBot>
            <OmniBot
              botName="Susi"
              stylist="small-box bg-warning"
              strategy="EMA"
            ></OmniBot>
            <OmniBot
              botName="Kiwi"
              stylist="small-box bg-success"
              strategy="SMA"
            ></OmniBot>
            <OmniBot
              botName="Controller"
              stylist="small-box bg-danger"
            ></OmniBot>
          </div>
          {/* /.row */}
          {/* Main row */}
          <div className="row">
            {/* Left col */}
            <MainSection></MainSection>
            {/* /.Left col */}
            {/* right col (We are only adding the ID to make the widgets sortable)*/}
            <ConnectPanel></ConnectPanel>
            {/* right col */}
          </div>
          {/* /.row (main row) */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
    // {/* .content-wrapper */}
  );
};

export default Dashboard1;
