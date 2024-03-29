import React, { useEffect, useContext } from "react";
import { CoinContext } from "../../Containers/Context/CoinContext";
import "../../Containers/Utils/style.scss";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";
import { BinanceContext } from "../../Containers/Context/BinanceContext";
import { BotContext } from "../../Containers/Context/BotContext";
import { LeaderboardContext } from "../../Containers/Context/LeaderboardContext";
import UserPosition from "./UserPosition";

const TopLeaderboard = () => {
  const { leaderboard } = useContext(CoinContext);
  const { updateAllPositions, callCMEReport, CMEReport } =
    useContext(LeaderboardContext);
  const { bot } = useContext(BotContext);
  const { runInterval, callLeaderboard } = useContext(BinanceContext);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (isMountedRef.current) {
      // calling a function from BinanceContext using react useCallback
      callLeaderboard();
      callCMEReport();
      //   let interval;
      //   if (runInterval) {
      //     interval = setInterval(() => {
      //       console.log("calling watchlist inside interval");
      //       callLeaderboard();
      //     }, 600000);
      //     return () => clearInterval(interval);
      //   } else {
      //     if (interval) {
      //       clearInterval(interval);
      //     }
      //   }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bot, isMountedRef, runInterval]);
  const handleUpdate = (e) => {
    updateAllPositions(leaderboard);
  };

  return (
    <section className="col-lg connectedSortable">
      {/* Custom tabs (Charts with tabs)*/}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-chart-pie mr-1" />
            <span>Binance Top 12 Leaderboard</span>
            <span>Latest CME date:</span>{" "}
            <span className="fw-bold">{CMEReport.date}</span>{" "}
            <span className="text-success fw-bold">{CMEReport.long}</span>{" "}
            <span className="text-danger fw-bold">{CMEReport.short}</span>{" "}
            <button className="btn btn-success" onClick={handleUpdate}>
              <i className="fa fa-repeat" aria-hidden="true"></i>
            </button>
          </h3>
          <div className="card-tools">
            {/* <ul className="nav nav-pills ml-auto">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#revenue-chart"
                  data-toggle="tab"
                >
                  USDT
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#sales-chart" data-toggle="tab">
                  BTC
                </a>
              </li>
            </ul> */}
          </div>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          {leaderboard.length > 0 &&
            leaderboard.map((e, index) => {
              return (
                <UserPosition
                  key={index}
                  uid={e.encryptedUid}
                  pnl={e.pnl}
                  roi={e.roi}
                  rank={e.rank}
                  nickname={e.nickName}
                  index={index}
                ></UserPosition>
              );
            })}
        </div>
        {/* /.card-body */}
      </div>
      {/* /.card */}
    </section>
  );
};

export default TopLeaderboard;
