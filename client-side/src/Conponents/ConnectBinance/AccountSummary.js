import React, { useContext, useEffect, useState } from "react";
import { UserAccount } from "../../Containers/Context/UserAccount";
import { CoinContext } from "../../Containers/Context/CoinContext";
import { BinanceContext } from "../../Containers/Context/BinanceContext";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";

const AccountSummary = () => {
  const { balance, openOrders, purchasePrice, setPurchasePrice } = useContext(
    UserAccount
  );
  const { coin } = useContext(CoinContext);
  const {
    runInterval,
    setRunInterval,
    callKlineData,
    callWatchlist,
    callAccountBalance,
    callCheckPrice,
    callOpenOrders,
    trailingDown,
    trailingUp,
  } = useContext(BinanceContext);
  const isMountedRef = useIsMountedRef();
  const [update, setUpdate] = useState(
    new Date().toLocaleString("en-US", { timeZone: "EST" })
  );
  const [runTrailing, setRunTrailing] = useState(false);
  const [trailingStop, setTrailingStop] = useState(0);

  let totalBalance = 0;
  //trailing stop function will first enter down & up rate that was pre-determined as 10 & 5
  //at 1st, it will set stop price as -10% of purchase price
  //if the market price go higher than 5%  it will re-adjust new stop price as -10% market price
  //the stop loss will go up with the market price. BEST THING FOR THE BULL MARKET - Hawk
  const handleTrailing = (symbol, findIndex) => {
    const marketPrice = parseFloat(coin[`${symbol}USDT`]);
    const boughtPrice = parseFloat(purchasePrice[findIndex]["price"]);
    if (runTrailing) {
      setRunTrailing(false);
    } else {
      setRunTrailing(true);
      if (marketPrice >= boughtPrice * (1 + trailingUp / 100)) {
        setTrailingStop(marketPrice * (1 - trailingDown / 100));
      } else {
        setTrailingStop(boughtPrice * (1 - trailingDown / 100));
      }
    }
  };

  useEffect(() => {
    if (isMountedRef.current) {
      // return () => {
      callCheckPrice();
      callAccountBalance();
      callOpenOrders();
      let interval;
      if (runInterval) {
        interval = setInterval(() => {
          callCheckPrice();
        }, 2500);
        return () => clearInterval(interval);
      } else {
        if (interval) {
          clearInterval(interval);
        }
      }
    }
  }, [isMountedRef, runInterval]);
  useEffect(() => {
    const callPurchasePrice = async () => {
      const endpoint = "callpurchaseprice";
      if (balance.length) {
        try {
          let response = await fetch(`/binance/${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(balance), // body data type must match "Content-Type" header
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const jsonResponse = await response.json();
            // const resultParse = JSON.parse(jsonResponse);
            console.log("callpurchaseprice holding trade ", jsonResponse);
            let tempArray = [];
            jsonResponse.forEach((e, i) => {
              const purchasedSymbol = e.symbol.substring(
                0,
                e.symbol.length - 4
              );
              if (e.symbol.toUpperCase() === "USDT") {
                tempArray.push({
                  symbol: e.symbol,
                  price: parseFloat(1),
                });
              } else {
                // find average purchase price buy comparing holding amount
                // then averaging up all separating orders
                let avgPurchasePrice = 0;
                let totalQty = 0;
                let totalPaid = 0;
                let totalSold = 0;
                // find balance index to get total holding in accnount
                const balanceIndex = balance.findIndex((element) => {
                  return element.symbol === purchasedSymbol;
                });
                for (let index = e.allTrade.length - 1; index >= 0; index--) {
                  // only count buy order by filtering out commission asset
                  if (e.allTrade[index].commissionAsset === purchasedSymbol) {
                    if (totalSold > 0) {
                      totalSold = totalSold - parseFloat(e.allTrade[index].qty);
                    } else {
                      totalQty = parseFloat(e.allTrade[index].qty) + totalQty;
                      totalPaid =
                        parseFloat(e.allTrade[index].quoteQty) + totalPaid;
                    }
                  } else {
                    totalSold = parseFloat(e.allTrade[index].qty) + totalSold;
                  }
                  // console.log(
                  //   "total qty",
                  //   totalQty,
                  //   "total paid",
                  //   totalPaid,
                  //   "total sold",
                  //   totalSold,
                  //   "purchase sym",
                  //   purchasedSymbol
                  // );
                  // if total quantity higher or equal to total holding,
                  // stop and calculate avg price
                  if (
                    totalQty >=
                      parseFloat(balance[balanceIndex].available) +
                        parseFloat(balance[balanceIndex].onOrder) ||
                    index === 0
                  ) {
                    avgPurchasePrice = totalPaid / totalQty;
                    break;
                  }
                }
                tempArray.push({
                  symbol: purchasedSymbol,
                  price: parseFloat(avgPurchasePrice),
                });
              }
            });
            setPurchasePrice(tempArray);
          }
        } catch (e) {
          console.log("calling test order error ", e);
        }
      }
    };
    callPurchasePrice();
  }, [isMountedRef, balance]);
  const controlUpdate = (e) => {
    e.preventDefault();
    callCheckPrice();
    callAccountBalance();
    callOpenOrders();
    callWatchlist();
    callKlineData();
    setUpdate(new Date().toLocaleString("en-US", { timeZone: "EST" }));
  };
  return (
    <section className="col-lg connectedSortable">
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
          <div className="row">
            <h4 className="col-sm-4">Account Balance: </h4>
            {/* Update all data  */}
            <div className="row col-sm">
              <div className="col-sm-4">
                <button className="btn btn-primary" onClick={controlUpdate}>
                  Update
                </button>
              </div>
              <div className="col-sm">
                <em>Lastest Update is: {update}</em>
              </div>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Coin</th>
                <th scope="col">Available</th>
                <th scope="col">On-Order</th>
                <th scope="col">USD Equivalent</th>
                <th scope="col">Purchased Price</th>
                <th scope="col">Profit & Loss</th>
                <th scope="col">Trailing Stop</th>
              </tr>
            </thead>
            <tbody>
              {balance &&
                balance.map((e, index) => {
                  let findIndex;
                  let syncPurchasePrice = false;
                  if (purchasePrice.length === balance.length) {
                    syncPurchasePrice = true;
                  }
                  if (purchasePrice.length && syncPurchasePrice) {
                    findIndex = purchasePrice.findIndex((element) => {
                      return element.symbol === e.symbol;
                    });
                  }
                  if (e.symbol.toUpperCase() === "USDT") {
                    totalBalance =
                      totalBalance +
                      (parseInt(e.available) + parseInt(e.onOrder));
                  } else {
                    totalBalance =
                      totalBalance +
                      coin[`${e.symbol}USDT`] *
                        (parseInt(e.available) + parseInt(e.onOrder));
                  }

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
                        {/* usd equivalent */}
                        {e.symbol.toUpperCase() === "USDT"
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(
                              parseInt(e.available) + parseInt(e.onOrder)
                            )
                          : new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(
                              coin[`${e.symbol}USDT`] *
                                (parseInt(e.available) + parseInt(e.onOrder))
                            )}
                      </td>
                      <td>
                        {/* purchase price */}
                        {findIndex !== -1 &&
                          syncPurchasePrice &&
                          new Intl.NumberFormat(
                            "en-US",
                            {
                              maximumFractionDigits: 6,
                              minimumFractionDigits: 2,
                            },
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          ).format(purchasePrice[findIndex]["price"])}
                      </td>
                      <td>
                        {/* profit & loss */}
                        {findIndex !== -1 && syncPurchasePrice && (
                          <span
                            className={
                              (coin[`${e.symbol}USDT`] -
                                purchasePrice[findIndex]["price"]) /
                                coin[`${e.symbol}USDT`] >
                              0
                                ? "bullish"
                                : "bearish"
                            }
                          >
                            {e.symbol.toUpperCase() === "USDT"
                              ? new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(0)
                              : new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(
                                  (coin[`${e.symbol}USDT`] -
                                    purchasePrice[findIndex]["price"]) *
                                    (parseFloat(e.available) +
                                      parseFloat(e.onOrder))
                                )}{" "}
                            (
                            {new Intl.NumberFormat("en-US", {
                              style: "percent",
                            }).format(
                              (coin[`${e.symbol}USDT`] -
                                purchasePrice[findIndex]["price"]) /
                                coin[`${e.symbol}USDT`]
                            )}
                            )
                          </span>
                        )}
                      </td>
                      <td>
                        {/* run trailing stop function */}
                        {findIndex !== -1 && syncPurchasePrice && (
                          <div className="row">
                            <div className="col-sm mx-auto">
                              <button
                                id="trailingButton"
                                className={
                                  runTrailing
                                    ? "btn btn-danger"
                                    : "btn btn-success"
                                }
                                onClick={(element) => {
                                  element.preventDefault();
                                  handleTrailing(e.symbol, findIndex);
                                }}
                              >
                                {runTrailing ? "Stop" : "Run"}
                              </button>
                            </div>
                            <div className="col-sm">Trailing Stop Price</div>
                          </div>
                        )}
                       </td>
                    </tr>
                  );
                })}
              <tr>
                <th>Total USD Uquivalent</th>
                <th>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalBalance)}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        {/* /.open orders table*/}
        <div className="card-footer bg-transparent">
          <h4>Manage Orders</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Coin</th>
                <th scope="col">Side</th>
                <th scope="col">Price</th>
                <th scope="col">Amount</th>
                <th scope="col">Filled</th>
                <th scope="col">Total USD</th>
              </tr>
            </thead>
            <tbody>
              {openOrders &&
                openOrders.map((e, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {new Date(e.time).toLocaleString("en-US", {
                          timeZone: "EST",
                        })}
                      </td>
                      <td>{e.symbol}</td>
                      <td>{e.side}</td>
                      <td>
                        {new Intl.NumberFormat(
                          "en-US",
                          {
                            maximumFractionDigits: 6,
                            minimumFractionDigits: 2,
                          },
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        ).format(e.price)}
                      </td>
                      <td>{parseFloat(e.origQty)}</td>
                      {/* calculate filled amount  */}
                      <td>{e.origQuoteOrderQty / e.origQty}%</td>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(e.origQty * e.price)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {/* /.open orders table */}
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

export default AccountSummary;
