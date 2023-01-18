import React, { useEffect, useState } from "react";
import "../../Containers/Utils/style.scss";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";

const UserPosition = ({ uid, pnl, roi, rank, nickname }) => {
  const isMountedRef = useIsMountedRef();
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
          setCurrentPosition([...jsonResponse.otherPositionRetList]);
        }
      } catch (e) {
        console.log("calling check single price error ", e);
      }
    };
    checkPosition();
  }, [uid, isMountedRef]);

  return (
    <section className="col-lg connectedSortable">
      {/* Custom tabs (Charts with tabs)*/}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-chart-pie mr-1" />
            <span className="fw-bold">{nickname}</span>
            {" WEEKLY "}
            <span className={pnl > 0 ? "bullish fw-bold" : "bearish fw-bold"}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(pnl)}
              /{new Intl.NumberFormat("en-US").format(roi * 100)}%
            </span>
          </h3>
          <div className="card-tools">
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
                        <td className={e.amount > 0 ? "bullish" : "bearish"}>
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
                          {new Intl.NumberFormat("en-US").format(e.roe)}%
                        </td>
                        <td>
                          {new Intl.NumberFormat("en-US").format(e.leverage)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
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
