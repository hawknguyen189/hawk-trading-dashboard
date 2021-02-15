import React, { useContext, useEffect, useState } from "react";
import { BinanceContext } from "../../Containers/Context/BinanceContext";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";
import { BotContext } from "../../Containers/Context/BotContext";
import { UserAccount } from "../../Containers/Context/UserAccount";

const MainControl = () => {
  const {
    runInterval,
    setRunInterval,
    callKlineData,
    callWatchlist,
    callAccountBalance,
    callCheckPrice,
  } = useContext(BinanceContext);
  const isMountedRef = useIsMountedRef();
  const { bot, setBot } = useContext(BotContext);
  const { balance } = useContext(UserAccount);
  const [runTrailing, setRunTrailing] = useState(false);
  const [runBot, setRunBot] = useState(false);
  const [update, setUpdate] = useState(
    new Date().toLocaleString("en-US", { timeZone: "EST" })
  );

  const controlInterval = (e) => {
    e.preventDefault();
    if (e.target.innerHTML.toUpperCase() === "ON") {
      setRunInterval(true);
    } else {
      setRunInterval(false);
    }
  };
  const controlTraling = (e) => {
    e.preventDefault();
    if (e.target.innerHTML.toUpperCase() === "ON") {
      // get down & up price & convert to number
      const downValue = parseFloat(document.getElementById("downValue").value);
      const upValue = parseFloat(document.getElementById("upValue").value);
      console.log(downValue, upValue);
      setRunTrailing(true);
    } else {
      setRunTrailing(false);
    }
  };
  const controlBots = (e) => {
    e.preventDefault();
    if (e.target.innerHTML.toUpperCase() === "ON") {
      if (!runInterval) {
        setRunInterval(true);
      }
      if (bot) {
        for (const property in bot) {
          console.log(`${property}: ${bot[property]}`);
          setBot((prevState) => ({
            ...prevState,
            [property]: {
              ...prevState[property],
              offline: false,
            },
          }));
        }
      }
      setRunBot(true);
    } else {
      if (runInterval) {
        setRunInterval(false);
      }
      if (bot) {
        for (const property in bot) {
          console.log(`${property}: ${bot[property]}`);
          setBot((prevState) => ({
            ...prevState,
            [property]: {
              ...prevState[property],
              offline: true,
            },
          }));
        }
        setRunBot(false);
      }
    }
  };
  const testPlaceOrder = (e) => {
    e.preventDefault();
    console.log("calling test order");
  };
  const controlUpdate = (e) => {
    e.preventDefault();
    callCheckPrice();
    callAccountBalance();
    callWatchlist();
    callKlineData();
    setUpdate(new Date().toLocaleString("en-US", { timeZone: "EST" }));
  };
  return (
    <section className="main-control col-sm container">
      {/* turn on interval  */}
      <div className="row border border-info rounded">
        <div className="col-sm">
          <p>Run Interval</p>
        </div>
        <div className="col-sm">
          <button className="btn btn-success" onClick={controlInterval}>
            On
          </button>
          <button className="btn btn-danger" onClick={controlInterval}>
            Off
          </button>
        </div>
        <div className="col-sm">
          <p>{runInterval ? "Interval On" : "Interval Off"} </p>
        </div>
      </div>
      {/* switch on bots */}
      <div className="row border border-info rounded">
        <div className="col-sm">
          <p>Activate BOTs</p>
        </div>
        <div className="col-sm">
          <button className="btn btn-success" onClick={controlBots}>
            On
          </button>
          <button className="btn btn-danger" onClick={controlBots}>
            Off
          </button>
        </div>
        <div className="col-sm">
          <p>{runBot ? "BOTs On" : "BOTs Off"} </p>
        </div>
      </div>
      {/* Update all data  */}
      <div className="row border border-info rounded">
        <div className="col-sm">
          <p>Update All Data</p>
        </div>
        <div className="col-sm">
          <button className="btn btn-primary" onClick={controlUpdate}>
            Update
          </button>
        </div>
        <div className="col-sm">
          <p>Lastest Update is: {update}</p>
        </div>
      </div>
      {/* traling stop */}
      <div className="row border border-info rounded">
        <div className="container">
          <div className="text-center">
            <h4>Run Trailing Stop</h4>
          </div>
        </div>
        <div className="container row">
          <div className="col-sm d-flex justify-content-around ">
            <button className="btn btn-success" onClick={controlTraling}>
              On
            </button>
            <button className="btn btn-danger" onClick={controlTraling}>
              Off
            </button>
            <button className="btn btn-info" onClick={testPlaceOrder}>
              Place Order
            </button>
          </div>
          <div className="col-sm  d-flex justify-content-center">
            <p>{runTrailing ? "Trailing Stop On" : "Trailing Stop Off"} </p>
          </div>
        </div>
        {/* input up and down price for the trailing stop  */}
        <div className="row mt-4">
          <div className="input-group mb-3 col-sm">
            <div className="input-group-prepend">
              <span className="input-group-text">DOWN</span>
            </div>
            <input
              type="number"
              id="downValue"
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
              defaultValue="10"
            />
            <div className="input-group-append">
              <span className="input-group-text">%</span>
            </div>
          </div>
          <div className="input-group mb-3 col-sm">
            <div className="input-group-prepend">
              <span className="input-group-text">UP</span>
            </div>
            <input
              type="number"
              id="upValue"
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
              defaultValue="5"
            />
            <div className="input-group-append">
              <span className="input-group-text">%</span>
            </div>
          </div>
        </div>
        {/* end input fields */}
      </div>
    </section>
  );
};

export default MainControl;
