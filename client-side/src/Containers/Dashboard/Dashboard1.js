import React, { useEffect, useContext } from "react";
// import DrawingChartJS from "../Utils/DashboardDrawing/DrawingChartJS";
// import Dashboard1Data from "./Data/Dashboard1Data";
import ConnectPanel from "../../Conponents/ConnectBinance/ConnectPanel";
import MainSection from "../../Conponents/ConnectBinance/MainSection";
import OmniBot from "../../Conponents/ConnectBinance/OmniBot";
import BotController from "../../Conponents/ConnectBinance/BotController";
import { CoinContext } from "../Context/CoinContext";
import { BotContext } from "../Context/BotContext";
import { useIsMountedRef } from "../Utils/CustomHook";

const Dashboard1 = () => {
  const isMountedRef = useIsMountedRef(); // fix React state update on an unmounted component
  //function set local storage
  const Storage = (order, botName) => {
    localStorage.setItem(botName, JSON.stringify({ [botName]: order }));
  };

  const { watchlist } = useContext(CoinContext);
  const { movingAverage, setMovingAverage } = useContext(CoinContext);
  const { bot, setBot } = useContext(BotContext);

  useEffect(() => {
    if (isMountedRef.current) {
      const callKlineData = async () => {
        const endpoint = "callklinedata";
        if (watchlist) {
          try {
            let response = await fetch(`/${endpoint}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify(watchlist), // body data type must match "Content-Type" header
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            } else {
              const jsonResponse = await response.json();
              // const resultParse = JSON.parse(jsonResponse);
              console.log("kline ", jsonResponse);
              setMovingAverage(jsonResponse);
            }
          } catch (e) {
            console.log("calling kline/candlestick error ", e);
          }
        }
      };
      callKlineData();
      const interval = setInterval(() => {
        callKlineData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [watchlist, isMountedRef]);

  useEffect(() => {
    const placeOrder = async (symbol, action, botName) => {
      //check and place a single order based on symbol pair
      console.log("check ask & bid order ", symbol);
      const endpoint = "checkorder";
      try {
        let response = await fetch(`/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ symbol: symbol }), // body data type must match "Content-Type" header
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const jsonResponse = await response.json();
          console.log("check order ", action, jsonResponse);
          if (action === "buy") {
            let order = {
              [botName]: {
                initialPrice: jsonResponse.askPrice,
                quantity: bot[botName].fund / jsonResponse.askPrice,
                status: "occupied",
                holding: jsonResponse.symbol,
              },
            };
            Storage({ ...bot[botName], ...order[botName] }, botName);
            setBot((prevState) => ({
              ...prevState,
              [botName]: {
                ...prevState[botName],
                ...order[botName],
              },
            }));
          } else if (action === "sell") {
            let order = {
              [botName]: {
                initialPrice: 0,
                quantity: 0,
                status: "vacant",
                holding: "",
                fund: bot[botName].quantity * jsonResponse.bidPrice,
              },
            };
            Storage({ ...bot[botName], ...order[botName] }, botName);
            setBot((prevState) => ({
              ...prevState,
              [botName]: {
                ...prevState[botName],
                ...order[botName],
              },
            }));
          }
        }
      } catch (e) {
        console.log("calling account balance error ", e);
      }
    };
    // code to judge placing an order
    // only run when movingAverage != empty
    // feel free to add more algo and safety lock for it
    const manageBot = async () => {
      if (movingAverage) {
        let assignedJob = {
          botkiwi: false,
          bothawk: false,
          botsusi: false,
        };
        for (let i = 0; i < movingAverage.length; i++) {
          if (bot) {
            for (let property in bot) {
              // console.log(property, bot[property]);
              if (bot[property].model === "SMA") {
                if (
                  movingAverage[i].SMA7 > movingAverage[i].SMA30 * 1.0015 &&
                  bot[property].status === "vacant" &&
                  bot[property].offline === false &&
                  assignedJob[property] === false
                ) {
                  assignedJob[property] = true;
                  await placeOrder(movingAverage[i].symbol, "buy", property);
                  break;
                }
                if (
                  bot[property].status === "occupied" &&
                  movingAverage[i].symbol === bot[property].holding &&
                  bot[property].offline === false &&
                  assignedJob[property] === false
                ) {
                  if (movingAverage[i].SMA7 < movingAverage[i].SMA30 * 1.0015) {
                    assignedJob[property] = true;
                    await placeOrder(movingAverage[i].symbol, "sell", property);
                    break;
                  }
                }
              } else if (bot[property].model === "SPOTMA") {
                if (
                  movingAverage[i].SMA7 > movingAverage[i].SMA30 * 1.0015 &&
                  bot[property].status === "vacant" &&
                  bot[property].offline === false &&
                  assignedJob[property] === false
                ) {
                  assignedJob[property] = true;
                  await placeOrder(movingAverage[i].symbol, "buy", property);
                  break;
                }
                if (
                  bot[property].status === "occupied" &&
                  movingAverage[i].symbol === bot[property].holding &&
                  bot[property].offline === false &&
                  assignedJob[property] === false
                ) {
                  if (movingAverage[i].SMA7 < movingAverage[i].SMA30 * 1.0015) {
                    assignedJob[property] = true;
                    await placeOrder(movingAverage[i].symbol, "sell", property);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    };
    manageBot();
    // *****************************
    // end working on bot
  }, [movingAverage]);

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
            <OmniBot botName="bothawk" stylist="small-box bg-info"></OmniBot>
            <OmniBot botName="botsusi" stylist="small-box bg-warning"></OmniBot>
            <OmniBot botName="botkiwi" stylist="small-box bg-success"></OmniBot>
            <BotController
              botName="Controller"
              stylist="small-box bg-danger"
            ></BotController>
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
