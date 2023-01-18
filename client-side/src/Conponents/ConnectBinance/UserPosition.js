import React, { useEffect, useState, useContext } from "react";
import "../../Containers/Utils/style.scss";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";
import { CoinContext } from "../../Containers/Context/CoinContext";

const UserPosition = ({ uid, pnl, roi, rank, nickname, index }) => {
  const isMountedRef = useIsMountedRef();
  const { leaderboard, setLeaderboard } = useContext(CoinContext);
  const [sumPNL, setSumPNL] = useState(0);
  const [currentPosition, setCurrentPosition] = useState("");

  useEffect(() => {
    const checkPosition = async () => {
      // console.log("call check price")
      const endpoint = "checkpositions";
      try {
        let response = await fetch(`/binance/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({ uid: uid }), // body data type must match "Content-Type" header
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const jsonResponse = await response.json();
          const positionArr = [...jsonResponse.otherPositionRetList];
          let sum = 0;
          if (jsonResponse.otherPositionRetList) {
            jsonResponse.otherPositionRetList.forEach((e) => {
              sum = e.pnl + sum;
            });
            setSumPNL(sum);
            setCurrentPosition([...positionArr]);
          }
        }
      } catch (e) {
        console.log("calling check single price error ", e);
      }
    };
    checkPosition();
  }, [uid, isMountedRef, index, setLeaderboard]);

  return (
    <section className="col-lg-9 mx-auto connectedSortable">
      {/* Custom tabs (Charts with tabs)*/}
      <div className="card">
        <div className="card-header">
          <div className="row">
            <h3 className="card-title">
              <i className="fas fa-chart-pie mr-1" />
              <a
                href={`https://www.binance.com/en/futures-activity/leaderboard/user?encryptedUid=${uid}`}
                className="card-link"
                target="_blank"
                rel="noreferrer"
              >
                {nickname}
              </a>
              {" WEEKLY "}
              <span className={pnl > 0 ? "bullish fw-bold" : "bearish fw-bold"}>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(pnl)}
                /{new Intl.NumberFormat("en-US").format(roi * 100)}%
              </span>{" "}
              <span
                className={sumPNL > 0 ? "bullish fw-bold" : "bearish fw-bold"}
              >
                total pnl =
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(sumPNL)}
              </span>
              <button
                className="btn btn-primary ml-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#positionList${index}`}
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                Show Position
              </button>
            </h3>
          </div>
          <div className="collapse" id={`positionList${index}`}>
            <div className="card card-body">
              <div className="col-lg">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Symbol</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Entry Price</th>
                      <th scope="col">Market Price</th>
                      <th scope="col">PNL/ROI</th>
                      <th scope="col">Leverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosition.length > 0 &&
                      currentPosition.map((e, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{e.symbol}</th>
                            <td
                              className={e.amount > 0 ? "bullish" : "bearish"}
                            >
                              {new Intl.NumberFormat("en-US").format(e.amount)}
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(e.entryPrice)}
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(e.markPrice)}
                            </td>
                            <td className={e.pnl > 0 ? "bullish" : "bearish"}>
                              {new Intl.NumberFormat("en-US").format(e.pnl)}/
                              {new Intl.NumberFormat("en-US").format(
                                e.roe * 100
                              )}
                              %
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-US").format(
                                e.leverage
                              )}
                              x
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* /.card-header */}
        <div className="card-body"></div>
        {/* /.card-body */}
      </div>
      {/* /.card */}
    </section>
  );
};

export default UserPosition;
