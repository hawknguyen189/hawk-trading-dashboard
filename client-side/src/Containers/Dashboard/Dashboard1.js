import React, { useEffect, useContext } from "react";
import AccountSummary from "../../Conponents/ConnectBinance/AccountSummary";
import MainControl from "../../Conponents/ConnectBinance/MainControl";
import TopLeaderboard from "../../Conponents/ConnectBinance/TopLeaderboard";
import OmniBot from "../../Conponents/ConnectBinance/OmniBot";
// import BotController from "../../Conponents/ConnectBinance/BotController";
import { CoinContext } from "../Context/CoinContext";
// import { BinanceContext } from "../Context/BinanceContext";
import { BotContext } from "../Context/BotContext";
// import { useIsMountedRef } from "../Utils/CustomHook";

const Dashboard1 = () => {
  // const isMountedRef = useIsMountedRef(); // fix React state update on an unmounted component
  //function set local storage
  const Storage = (order, botName) => {
    localStorage.setItem(botName, JSON.stringify({ [botName]: order }));
  };

  // const { runInterval, callKlineData } = useContext(BinanceContext);
  // const { watchlist } = useContext(CoinContext);
  const { movingAverage } = useContext(CoinContext);
  const { coin } = useContext(CoinContext);
  const { bot, setBot, pause, setPause } = useContext(BotContext);

  // useEffect(() => {
  //   if (isMountedRef.current) {
  //     // calling a function from BinanceContext using react useCallback
  //     callKlineData();
  //     let interval;
  //     if (runInterval) {
  //       interval = setInterval(() => {
  //         callKlineData();
  //       }, 10000);
  //       return () => clearInterval(interval);
  //     } else {
  //       if (interval) {
  //         clearInterval(interval);
  //       }
  //     }
  //   }
  // }, [watchlist, isMountedRef, runInterval]);

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
          // eslint-disable-next-line no-unused-vars
          const btcWatchDog = (async () => {
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
            if (
              btcMA.EMA7 > btcMA.EMA30 * 1.003 &&
              bot["btcwatchdog"].status === "vacant" &&
              bot["btcwatchdog"].offline === false &&
              assignedJob["btcwatchdog"] === false &&
              pause === false
            ) {
              assignedJob["btcwatchdog"] = true;
              await placeOrder(btcMA.symbol, "buy", "btcwatchdog");
            }
            if (
              //sell order
              bot["btcwatchdog"].status === "occupied" &&
              btcMA.symbol === bot["btcwatchdog"].holding &&
              bot["btcwatchdog"].offline === false &&
              assignedJob["btcwatchdog"] === false
            ) {
              if (btcMA.EMA7 < btcMA.SMA30 * 0.997) {
                assignedJob["btcwatchdog"] = true;
                await placeOrder(btcMA.symbol, "sell", "btcwatchdog");
              }
            }
          })();
          // eslint-disable-next-line no-unused-vars
          const ethWatchDog = (async () => {
            //btc watchdog function will run automatiacally
            const ethMA = movingAverage.find((e) => e.symbol === "ETHUSDT");
            if (
              ethMA.EMA7 > ethMA.EMA30 * 1.003 &&
              bot["ethwatchdog"].status === "vacant" &&
              bot["ethwatchdog"].offline === false &&
              assignedJob["ethwatchdog"] === false &&
              pause === false
            ) {
              assignedJob["ethwatchdog"] = true;
              await placeOrder(ethMA.symbol, "buy", "ethwatchdog");
            }
            if (
              //sell order
              bot["ethwatchdog"].status === "occupied" &&
              ethMA.symbol === bot["ethwatchdog"].holding &&
              bot["ethwatchdog"].offline === false &&
              assignedJob["ethwatchdog"] === false
            ) {
              if (ethMA.EMA7 < ethMA.SMA30 * 0.997) {
                assignedJob["ethwatchdog"] = true;
                await placeOrder(ethMA.symbol, "sell", "ethwatchdog");
              }
            }
          })();

          for (let i = 0; i < movingAverage.length; i++) {
            for (let property in bot) {
              // console.log(property, bot[property]);
              if (bot[property].model === "SMA") {
                // A bullish crossover occurs when the shorter moving average
                // crosses above the longer moving average. This is also known as a golden cross.
                // A bearish crossover occurs when the shorter moving average crosses below the
                // longer moving average. This is known as a dead cross.
                if (
                  movingAverage[i].SMA7 > movingAverage[i].SMA30 * 1.003 &&
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
                  if (movingAverage[i].SMA7 < movingAverage[i].SMA30 * 0.997) {
                    assignedJob[property] = true;
                    await placeOrder(movingAverage[i].symbol, "sell", property);
                    break;
                  }
                }
              } else if (bot[property].model === "EMAp") {
                if (
                  movingAverage[i].EMA5 > movingAverage[i].EMA30p * 1.003 &&
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
                  if (movingAverage[i].EMA5 < movingAverage[i].EMA30p * 1.003) {
                    assignedJob[property] = true;
                    await placeOrder(movingAverage[i].symbol, "sell", property);
                    break;
                  }
                }
              } else if (bot[property].model === "SMLMA") {
                if (
                  movingAverage[i].SMA5 > movingAverage[i].SMA10 * 1.0015 &&
                  movingAverage[i].SMA10 > movingAverage[i].SMA30 * 1.0015 &&
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
                  if (movingAverage[i].SMA5 < movingAverage[i].SMA10 * 1.0015) {
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
              } else if (bot[property].model === "EMA") {
                //EMA start here
                // A bullish crossover occurs when the shorter moving average
                // crosses above the longer moving average. This is also known as a golden cross.
                // A bearish crossover occurs when the shorter moving average crosses below the
                // longer moving average. This is known as a dead cross.
                if (
                  movingAverage[i].EMA7 > movingAverage[i].EMA30 * 1.003 &&
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
                  if (movingAverage[i].EMA7 < movingAverage[i].SMA30 * 0.997) {
                    assignedJob[property] = true;
                    await placeOrder(movingAverage[i].symbol, "sell", property);
                    break;
                  }
                }
              } //end EMA condition
              //end if condition for managing bots
            } //end for loop over moving average
          }
        } //if bot exists
      }
    };
    manageBot();
    // *****************************
    // end working on bot
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className="col-sm-9">
              <div className="row d-flex justify-content-center">
                {/* small box */}
                <OmniBot
                  botName="botkiwi"
                  stylist="small-box bg-info"
                ></OmniBot>
                <OmniBot
                  botName="bothawk"
                  stylist="small-box bg-warning"
                ></OmniBot>
                <OmniBot
                  botName="botsusi"
                  stylist="small-box bg-success"
                ></OmniBot>
              </div>
            </div>
            <MainControl></MainControl>
          </div>
          {/* /.row */}
          {/* Main row */}
          <div className="row">
            {/* Left col */}
            <TopLeaderboard></TopLeaderboard>
            {/* /.Left col */}
            {/* right col (We are only adding the ID to make the widgets sortable)*/}
            {/* <AccountSummary></AccountSummary> */}
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
