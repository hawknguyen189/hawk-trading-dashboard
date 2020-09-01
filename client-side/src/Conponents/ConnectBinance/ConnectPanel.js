import React, { useContext, useEffect } from "react";
import { UserAccount } from "../../Containers/Context/UserAccount";
import { CoinContext } from "../../Containers/Context/CoinContext";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";

const ConnectPanel = () => {
  const { balance, setBalance } = useContext(UserAccount);
  const { coin, setCoin } = useContext(CoinContext);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (isMountedRef.current) {
      const callAccountBalance = async () => {
        console.log("call account balance ");
        const endpoint = "callaccountbalance";
        try {
          let response = await fetch(`/${endpoint}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const jsonResponse = await response.json();
            // const resultParse = JSON.parse(jsonResponse);
            let mainBalance = [];
            for (let property in jsonResponse) {
              // console.log(parseInt(jsonResponse[property]["onOrder"]));
              if (
                parseInt(jsonResponse[property]["available"]) > 0 ||
                parseInt(jsonResponse[property]["onOrder"]) > 0
              ) {
                mainBalance.push({
                  symbol: property,
                  ...jsonResponse[property],
                });
              }
            }
            setBalance(mainBalance);
          }
        } catch (e) {
          console.log("calling account balance error ", e);
        }
      };
      const callCheckPrice = async () => {
        // console.log("call check price")
        const endpoint = "callcheckprice";
        try {
          let response = await fetch(`/${endpoint}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const jsonResponse = await response.json();
            // const resultParse = JSON.parse(jsonResponse);
            // let allPrice = [];
            // for (let property in jsonResponse) {
            //   // console.log(parseInt(jsonResponse[property]["onOrder"]));
            //   allPrice.push(property);
            // }
            // console.log("all price ", allPrice);
            setCoin(jsonResponse);
          }
        } catch (e) {
          console.log("calling check all price error ", e);
        }
      };
      // return () => {
      callAccountBalance();
      callCheckPrice();
      const interval = setInterval(() => {
        callCheckPrice();
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isMountedRef]);
  return (
    <section className="col-lg-4 connectedSortable">
      {/* Map card */}
      <div className="card ">
        <div className="card-header border-0">
          <h3 className="card-title">
            <i className="fas fa-map-marker-alt mr-1" />
            Account Summary
          </h3>
          {/* card tools */}
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-primary btn-sm daterange"
              data-toggle="tooltip"
              title="Date range"
            >
              <i className="far fa-calendar-alt" />
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              data-card-widget="collapse"
              data-toggle="tooltip"
              title="Collapse"
            >
              <i className="fas fa-minus" />
            </button>
          </div>
          {/* /.card-tools */}
        </div>
        <div className="card-body">
          <h6>Account Balance: </h6>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Coin</th>
                <th scope="col">Available</th>
                <th scope="col">On-Order</th>
                <th scope="col">USD Equivalent</th>
              </tr>
            </thead>
            <tbody>
              {balance &&
                balance.map((e, index) => {
                  return (
                    <tr key={index}>
                      <td>{e.symbol}</td>
                      <td>
                        {new Intl.NumberFormat("en-US").format(e.available)}
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-US").format(e.onOrder)}
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(
                          coin[`${e.symbol}USDT`] *
                            (parseInt(e.available) + parseInt(e.onOrder))
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {/* /.card-body*/}
        <div className="card-footer bg-transparent">
          <h6>Favorite Coins</h6>
          <div className="row">
            <div className="col-4 text-center">
              <div className="">
                IOTA{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(coin[`IOTAUSDT`])}
              </div>
            </div>
            {/* ./col */}
            <div className="col-4 text-center">
              SRM{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(coin[`SRMUSDT`])}
            </div>
            {/* ./col */}
            <div className="col-4 text-center">
              BAT{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(coin[`BATUSDT`])}
            </div>
            {/* ./col */}
          </div>
          {/* /.row */}
        </div>
      </div>
      {/* /.card */}
      {/* solid sales graph */}
      <div className="card bg-gradient-info">
        <div className="card-header border-0">
          <h3 className="card-title">
            <i className="fas fa-th mr-1" />
            Chart Graph
          </h3>
          <div className="card-tools">
            <button
              type="button"
              className="btn bg-info btn-sm"
              data-card-widget="collapse"
            >
              <i className="fas fa-minus" />
            </button>
            <button
              type="button"
              className="btn bg-info btn-sm"
              data-card-widget="remove"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
        <div className="card-body">
          <canvas
            className="chart"
            id="line-chart"
            style={{
              minHeight: 250,
              height: 250,
              maxHeight: 250,
              maxWidth: "100%",
            }}
          />
        </div>
        {/* /.card-body */}
        <div className="card-footer bg-transparent">
          <div className="row">
            <div className="col-4 text-center">
              <input
                type="text"
                className="knob"
                data-readonly="true"
                defaultValue={20}
                data-width={60}
                data-height={60}
                data-fgcolor="#39CCCC"
              />
              <div className="text-white">Mail-Orders</div>
            </div>
            {/* ./col */}
            <div className="col-4 text-center">
              <input
                type="text"
                className="knob"
                data-readonly="true"
                defaultValue={50}
                data-width={60}
                data-height={60}
                data-fgcolor="#39CCCC"
              />
              <div className="text-white">Online</div>
            </div>
            {/* ./col */}
            <div className="col-4 text-center">
              <input
                type="text"
                className="knob"
                data-readonly="true"
                defaultValue={30}
                data-width={60}
                data-height={60}
                data-fgcolor="#39CCCC"
              />
              <div className="text-white">In-Store</div>
            </div>
            {/* ./col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.card-footer */}
      </div>
      {/* /.card */}
      {/* Calendar */}
      <div className="card bg-gradient-success">
        <div className="card-header border-0">
          <h3 className="card-title">
            <i className="far fa-calendar-alt" />
            Calendar
          </h3>
          {/* tools card */}
          <div className="card-tools">
            {/* button with a dropdown */}
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-success btn-sm dropdown-toggle"
                data-toggle="dropdown"
              >
                <i className="fas fa-bars" />
              </button>
              <div className="dropdown-menu float-right" role="menu">
                <a href="/" className="dropdown-item">
                  Add new event
                </a>
                <a href="/" className="dropdown-item">
                  Clear events
                </a>
                <div className="dropdown-divider" />
                <a href="/" className="dropdown-item">
                  View calendar
                </a>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-success btn-sm"
              data-card-widget="collapse"
            >
              <i className="fas fa-minus" />
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm"
              data-card-widget="remove"
            >
              <i className="fas fa-times" />
            </button>
          </div>
          {/* /. tools */}
        </div>
        {/* /.card-header */}
        <div className="card-body pt-0">
          {/*The calendar */}
          <div id="calendar" style={{ width: "100%" }} />
        </div>
        {/* /.card-body */}
      </div>
      {/* /.card */}
    </section>
  );
};

export default ConnectPanel;