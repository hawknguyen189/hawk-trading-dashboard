import React, { useContext, useEffect, useState } from "react";
import { UserAccount } from "../../Containers/Context/UserAccount";
import { CoinContext } from "../../Containers/Context/CoinContext";
import { BinanceContext } from "../../Containers/Context/BinanceContext";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";

const AccountSummary = () => {
  // context vars
  const { balance, openOrders, purchasePrice, setPurchasePrice } = useContext(
    UserAccount
  );
  const { coin } = useContext(CoinContext);
  const {
    runInterval,
    callWatchlist,
    callAccountBalance,
    callCheckPrice,
    callOpenOrders,
    trailingDown,
    trailingUp,
    callMarketSell,
  } = useContext(BinanceContext);
  const isMountedRef = useIsMountedRef();
  // state vars
  const [update, setUpdate] = useState(
    new Date().toLocaleString("en-US", { timeZone: "EST" })
  );
  const [panicAsset, setPanicAsset] = useState("");
  const [panicQty, setPanicQty] = useState("");
  const [trailingStop, setTrailingStop] = useState({});
  const [trailingInterval, setTrailingInterval] = useState(); //need a state var to avoid getting reset every time we call func
  let totalBalance = 0;

  const handleTrailing = (symbol, findIndex, balanceIndex) => {
    //trailing stop function will first enter down & up rate that was pre-determined as 10 & 5
    //at 1st, it will set stop price as -10% of purchase price
    //if the market price go higher than 5%  it will re-adjust new stop price as -10% market price
    //the stop loss will go up with the market price. BEST THING FOR THE BULL MARKET - Hawk
    const tempArr = [...purchasePrice];
    const boughtPrice = parseFloat(purchasePrice[findIndex]["price"]).toFixed(
      3
    );
    // check 1 single coin price
    const callCheckSingle = async () => {
      // console.log("call check price")
      const endpoint = "callchecksingle";
      try {
        let response = await fetch(`/binance/${endpoint}`, {
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
          //updating this setTrailingStop will trigger below controlTrailing function
          setTrailingStop((prev) => ({
            ...prev,
            [symbol]: {
              symbol: symbol,
              marketPrice: parseFloat(jsonResponse[`${symbol}USDT`]).toFixed(5),
              boughtPrice: boughtPrice,
              purchasePriceIndex: findIndex,
              balanceIndex: balanceIndex,
            },
          }));
        }
      } catch (e) {
        console.log("calling check single price error ", e);
      }
    };
    // update trailing stop data
    if (tempArr[findIndex]["runTrailing"]) {
      // trailing stop is running & btn clicked so we stop it
      tempArr[findIndex]["runTrailing"] = false;
      tempArr[findIndex]["trailingPrice"] = 0;
      // console.log("clear timer", symbol);
      clearInterval(trailingInterval[symbol]); //clear calling check price interval

      if (trailingStop[symbol]) {
        // delete asset from trailing stop list
        const tempState = { ...trailingStop };
        delete tempState[symbol];
        setTrailingStop(tempState);
      }
    } else {
      // trailing stop is not wokring => run it now
      setTrailingInterval((prev) => ({
        ...prev,
        [symbol]: setInterval(() => {
          // console.log("timer", symbol);
          callCheckSingle(); //set timeInterval here to keep it running
        }, 3500),
      }));

      tempArr[findIndex]["runTrailing"] = true;
    }

    setPurchasePrice(tempArr);
  };

  const controlTrailing = (symbol) => {
    //func will be called when update on trailingStop
    const tempArr = [...purchasePrice];
    // decide to sell at trailing stop price ?
    if (
      tempArr[trailingStop[symbol].purchasePriceIndex]["trailingPrice"] >=
      trailingStop[symbol].marketPrice
    ) {
      callMarketSell({
        symbol: symbol,
        qty: parseFloat(
          Math.floor(
            balance[trailingStop[symbol].balanceIndex]["available"] * 100
          ) / 100 //floor will round to the lowest integer
        ),
      });
      clearInterval(trailingInterval[symbol]); //clear calling check price interval
      tempArr[trailingStop[symbol].purchasePriceIndex]["runTrailing"] = false;
      tempArr[trailingStop[symbol].purchasePriceIndex]["trailingPrice"] = 0;
    } else {
      if (
        trailingStop[symbol].marketPrice >=
        trailingStop[symbol].boughtPrice * (1 + trailingUp / 100)
      ) {
        if (
          tempArr[trailingStop[symbol].purchasePriceIndex]["trailingPrice"] <
          trailingStop[symbol].marketPrice * (1 - trailingDown / 100)
        ) {
          // only update new trailing price if the new one higher than prev one
          //aim to maximize profit on stop loss
          tempArr[trailingStop[symbol].purchasePriceIndex]["trailingPrice"] = (
            trailingStop[symbol].marketPrice *
            (1 - trailingDown / 100)
          ).toFixed(5);
        }
      } else {
        tempArr[trailingStop[symbol].purchasePriceIndex]["trailingPrice"] = (
          trailingStop[symbol].boughtPrice *
          (1 - trailingDown / 100)
        ).toFixed(5);
      }
    }

    // update purchasePrice context
    setPurchasePrice(tempArr);
  };
  useEffect(() => {
    //this useEffect is for running controlTrailing when update on trailingStop
    if (Object.keys(trailingStop).length && purchasePrice.length) {
      //check if not empty
      for (const property in trailingStop) {
        controlTrailing(property);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trailingStop]); //re-run when trailingStop state gets updated

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  runTrailing: false,
                  trailingPrice: 0,
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
                  if (
                    e.allTrade[index].commissionAsset === purchasedSymbol ||
                    e.allTrade[index].commissionAsset === "BNB"
                  ) {
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
                  runTrailing: false,
                  trailingPrice: 0,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMountedRef, balance]);
  const controlUpdate = (e) => {
    e.preventDefault();
    callCheckPrice();
    callAccountBalance();
    callOpenOrders();
    callWatchlist();
    // callKlineData();
    setUpdate(new Date().toLocaleString("en-US", { timeZone: "EST" }));
  };
  const controlPanicSell = (e) => {
    e.preventDefault();
    if (panicAsset && panicQty && panicAsset !== "Asset?") {
      if (
        window.confirm(
          `Are you sure you want to market sell ${panicQty} ${panicAsset}?`
        )
      ) {
        callMarketSell({
          symbol: panicAsset,
          qty: panicQty,
        });
      }
    } else {
      alert("Please input asset (ex: ETHUP or ETHDOWN) and total quantity");
    }
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
              <div className="col-sm-2">
                <button className="btn btn-primary" onClick={controlUpdate}>
                  Update
                </button>
              </div>
              <div className="col-sm-7">
                <div className="input-group mb-3">
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    id="button-addon1"
                    onClick={controlPanicSell}
                  >
                    Panic Sell
                  </button>
                  <select
                    className="form-select"
                    aria-label="select asset"
                    onChange={(e) => setPanicAsset(e.target.value)}
                  >
                    <option defaultValue>Asset?</option>
                    {balance.length &&
                      balance.map((e, index) => {
                        return (
                          <option value={e.symbol} key={index}>
                            {e.symbol}
                          </option>
                        );
                      })}
                  </select>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="qty"
                    aria-label="total quantity"
                    onChange={(e) => setPanicQty(e.target.value)}
                    value={panicQty}
                  />
                  <a
                    href="/"
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      if (panicAsset) {
                        const found = balance.findIndex(
                          (e) => e.symbol === panicAsset.toUpperCase()
                        );
                        setPanicQty(
                          parseFloat(balance[found].available).toFixed(2)
                        );
                      }
                    }}
                  >
                    Max?
                  </a>
                </div>
              </div>
              <div className="col-sm">
                <em>Lastest Update: {update}</em>
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
                      (parseFloat(e.available) + parseFloat(e.onOrder));
                  } else {
                    totalBalance =
                      totalBalance +
                      coin[`${e.symbol}USDT`] *
                        (parseFloat(e.available) + parseFloat(e.onOrder));
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
                              parseFloat(e.available) + parseFloat(e.onOrder)
                            )
                          : new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(
                              coin[`${e.symbol}USDT`] *
                                (parseFloat(e.available) +
                                  parseFloat(e.onOrder))
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
                                id={`trailing${e.symbol}`}
                                className={
                                  purchasePrice[findIndex]["runTrailing"]
                                    ? "btn btn-danger"
                                    : "btn btn-success"
                                }
                                onClick={(element) => {
                                  element.preventDefault();
                                  handleTrailing(e.symbol, findIndex, index);
                                }}
                              >
                                {purchasePrice[findIndex]["runTrailing"]
                                  ? "Stop"
                                  : "Run"}
                              </button>
                            </div>
                            <div className="col-sm">
                              Trailing Stop Price:{" "}
                              {purchasePrice[findIndex]["trailingPrice"]}
                            </div>
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
              {openOrders.length &&
                openOrders?.map((e, index) => {
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
