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
  const { coin, setCoin } = useContext(CoinContext);
  const { bot, setBot, pause, setPause } = useContext(BotContext);

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
      console.log("check ask & bid order ", symbol, botName);
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
        //get all the bot name to manage assigning jobs
        if (bot) {
          const botArray = Object.keys(bot);
          let assignedJob = {};
          botArray.forEach((e) => (assignedJob[e] = false));

          const btcWatchDog = (() => {
            //btc watchdog function will run automatiacally
            const btcMA = movingAverage.find((e) => e.symbol === "BTCUSDT");
            //setting up watch dog bitcoin
            // basic knowledge is to compare bitcoin spot vs kline 1m
            //if fluctuation higher than 100usd then pause all bots
            // console.log("inside watchdog");
            // if (parseFloat(coin["BTCUSDT"]) - movingAverage[i].SMA7 < -50) {
            if (
              parseFloat(coin["BTCUSDT"]) - btcMA.SMA7 < -75 &&
              pause === false
            ) {
              botArray.forEach((e) => (assignedJob[e] = true)); //stop all bots in roundin case react update pause context late
              console.log("done pausing");
              setPause(true);
            } else if (
              parseFloat(coin["BTCUSDT"]) - btcMA.SMA7 > 75 &&
              pause === true
            ) {
              console.log("unpause all coins");
              setPause(false);
            }
          })();

          for (let i = 0; i < movingAverage.length; i++) {
            for (let property in bot) {
              // console.log(property, bot[property]);
              if (bot[property].model === "SMA") {
                if (
                  movingAverage[i].SMA7 > movingAverage[i].SMA30 * 1.002 &&
                  bot[property].status === "vacant" &&
                  bot[property].offline === false &&
                  assignedJob[property] === false &&
                  pause === false
                ) {
                  assignedJob[property] = true;
                  await placeOrder(movingAverage[i].symbol, "buy", property);
                  break;
                }
                if (
                  //sell order
                  bot[property].status === "occupied" &&
                  movingAverage[i].symbol === bot[property].holding &&
                  bot[property].offline === false &&
                  assignedJob[property] === false
                ) {
                  if (movingAverage[i].SMA7 < movingAverage[i].SMA30 * 0.998) {
                    assignedJob[property] = true;
                    await placeOrder(movingAverage[i].symbol, "sell", property);
                    break;
                  }
                }
              } else if (bot[property].model === "SPOTMA") {
                //setting condition for Spot price vs MA (Price Crossovers)
                //The longer moving average sets the tone for the bigger trend and the
                // shorter moving average is used to generate the signals.
                if (
                  //bot will buy if spot price higher than 1.005 SMA7
                  parseFloat(coin[movingAverage[i].symbol]) >
                    movingAverage[i].SMA30 * 1.0035 &&
                  bot[property].status === "vacant" &&
                  bot[property].offline === false &&
                  assignedJob[property] === false &&
                  pause === false
                ) {
                  console.log(
                    "this is the spot price ",
                    coin[movingAverage[i].symbol],
                    "SMA7 is ",
                    movingAverage[i].SMA7
                  );
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
                  if (
                    //sell order
                    //bot will sell if spot price higher less 1.005 SMA7
                    parseFloat(coin[movingAverage[i].symbol]) <
                    movingAverage[i].SMA30 * 0.998
                  ) {
                    console.log(
                      "this is the spot price ",
                      coin[movingAverage[i].symbol],
                      "SMA7 is ",
                      movingAverage[i].SMA7
                    );
                    assignedJob[property] = true;
                    await placeOrder(movingAverage[i].symbol, "sell", property);
                    break;
                  }
                }
              }
              //end if condition for managing bots
            } //end for loop over moving average
          }
        } //if bot exists
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
            <OmniBot
              botName="btcwatchdog"
              stylist="small-box bg-danger"
            ></OmniBot>
            {/* <BotController
              botName="Controller"
              stylist="small-box bg-danger"
            ></BotController> */}
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
