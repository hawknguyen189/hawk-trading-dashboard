import React, { useContext, useEffect, useState } from "react";
import { BinanceContext } from "../../Containers/Context/BinanceContext";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";
import { BotContext } from "../../Containers/Context/BotContext";
import { UserAccount } from "../../Containers/Context/UserAccount";

const MainControl = () => {
  const {
    runInterval,
    setRunInterval,
    trailingDown,
    setTrailingDown,
    trailingUp,
    setTrailingUp,
  } = useContext(BinanceContext);
  const { bot, setBot } = useContext(BotContext);
  const [runBot, setRunBot] = useState(false);

  const controlInterval = (e) => {
    e.preventDefault();
    if (e.target.innerHTML.toUpperCase() === "ON") {
      setRunInterval(true);
    } else {
      setRunInterval(false);
    }
  };
  const handleDown = (e) => {
    const downValue = parseFloat(document.getElementById("downValue").value);
    setTrailingDown(downValue);
  };
  const handleUp = (e) => {
    const upValue = parseFloat(document.getElementById("upValue").value);
    setTrailingUp(upValue);
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
      {/* traling stop */}
      <div className="row border border-info rounded">
        <div className="container">
          <div className="text-center">
            <h4>Run Trailing Stop</h4>
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
              defaultValue={trailingDown}
              onChange={handleDown}
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
              defaultValue={trailingUp}
              onChange={handleUp}
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
