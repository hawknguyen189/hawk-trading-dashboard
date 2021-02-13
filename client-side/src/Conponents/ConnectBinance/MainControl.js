import React, { useContext, useEffect } from "react";
import { ControlContext } from "../../Containers/Context/ControlContext";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";
import { BotContext } from "../../Containers/Context/BotContext";

const MainControl = () => {
  const { runInterval, setRunInterval } = useContext(ControlContext);
  const isMountedRef = useIsMountedRef();
  const { bot, setBot } = useContext(BotContext);

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
      //   setRunInterval(true);
    } else {
      //   setRunInterval(false);
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
      }
    }
  };
  return (
    <section className="main-control col-sm container">
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
          <p>{runInterval ? "BOTs On" : "BOTs Off"} </p>
        </div>
      </div>
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
          </div>
          <div className="col-sm  d-flex justify-content-center">
            <p>{runInterval ? "Trailing Stop On" : "Trailing Stop Off"} </p>
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
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
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
              className="form-control"
              aria-label="Amount (to the nearest dollar)"
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
