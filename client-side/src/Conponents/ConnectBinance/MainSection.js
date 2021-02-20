import React, { useEffect, useContext } from "react";
import { CoinContext } from "../../Containers/Context/CoinContext";
import "../../Containers/Utils/style.scss";
import { useIsMountedRef } from "../../Containers/Utils/CustomHook";
import { BinanceContext } from "../../Containers/Context/BinanceContext";
import { BotContext } from "../../Containers/Context/BotContext";

const MainSection = () => {
  const { watchlist } = useContext(CoinContext);
  const { bot } = useContext(BotContext);
  const { runInterval, callWatchlist } = useContext(BinanceContext);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (isMountedRef.current) {
      // calling a function from BinanceContext using react useCallback
      callWatchlist();
      let interval;
      if (runInterval) {
        interval = setInterval(() => {
          console.log("calling watchlist inside interval");
          callWatchlist();
        }, 900000);
        return () => clearInterval(interval);
      } else {
        if (interval) {
          clearInterval(interval);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bot, isMountedRef, runInterval]);

  return (
    <section className="col-lg-6 connectedSortable">
      {/* Custom tabs (Charts with tabs)*/}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-chart-pie mr-1" />
            Binance Watchlist
          </h3>
          <div className="card-tools">
            <ul className="nav nav-pills ml-auto">
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
            </ul>
          </div>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Pair</th>
                <th scope="col">Last Price</th>
                <th scope="col">24h Change</th>
                <th scope="col">24h High</th>
                <th scope="col">24h Low</th>
                <th scope="col">24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {watchlist &&
                watchlist.map((e, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{e.symbol}</th>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(e.lastPrice)}
                      </td>
                      <td
                        className={
                          e.priceChangePercent > 0 ? "bullish" : "bearish"
                        }
                      >
                        {new Intl.NumberFormat("en-US").format(
                          e.priceChangePercent
                        )}
                        %
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(e.highPrice)}
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(e.lowPrice)}
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-US").format(e.quoteVolume)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {/* /.card-body */}
      </div>
      {/* /.card */}
      {/* DIRECT CHAT */}
      <div className="card direct-chat direct-chat-primary">
        <div className="card-header">
          <h3 className="card-title">Direct Chat</h3>
          <div className="card-tools">
            <span
              data-toggle="tooltip"
              title="3 New Messages"
              className="badge badge-primary"
            >
              3
            </span>
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="collapse"
            >
              <i className="fas fa-minus" />
            </button>
            <button
              type="button"
              className="btn btn-tool"
              data-toggle="tooltip"
              title="Contacts"
              data-widget="chat-pane-toggle"
            >
              <i className="fas fa-comments" />
            </button>
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="remove"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          {/* Conversations are loaded here */}
          <div className="direct-chat-messages">
            {/* Message. Default to the left */}
            <div className="direct-chat-msg">
              <div className="direct-chat-infos clearfix">
                <span className="direct-chat-name float-left">
                  Alexander Pierce
                </span>
                <span className="direct-chat-timestamp float-right">
                  23 Jan 2:00 pm
                </span>
              </div>
              {/* /.direct-chat-infos */}
              {/* /.direct-chat-img */}
              <div className="direct-chat-text">
                Is this template really for free? That's unbelievable!
              </div>
              {/* /.direct-chat-text */}
            </div>
            {/* /.direct-chat-msg */}
            {/* Message to the right */}
            <div className="direct-chat-msg right">
              <div className="direct-chat-infos clearfix">
                <span className="direct-chat-name float-right">
                  Sarah Bullock
                </span>
                <span className="direct-chat-timestamp float-left">
                  23 Jan 2:05 pm
                </span>
              </div>
              {/* /.direct-chat-infos */}
              {/* /.direct-chat-img */}
              <div className="direct-chat-text">You better believe it!</div>
              {/* /.direct-chat-text */}
            </div>
            {/* /.direct-chat-msg */}
            {/* Message. Default to the left */}
            <div className="direct-chat-msg">
              <div className="direct-chat-infos clearfix">
                <span className="direct-chat-name float-left">
                  Alexander Pierce
                </span>
                <span className="direct-chat-timestamp float-right">
                  23 Jan 5:37 pm
                </span>
              </div>
              {/* /.direct-chat-infos */}

              {/* /.direct-chat-img */}
              <div className="direct-chat-text">
                Working with AdminLTE on a great new app! Wanna join?
              </div>
              {/* /.direct-chat-text */}
            </div>
            {/* /.direct-chat-msg */}
            {/* Message to the right */}
            <div className="direct-chat-msg right">
              <div className="direct-chat-infos clearfix">
                <span className="direct-chat-name float-right">
                  Sarah Bullock
                </span>
                <span className="direct-chat-timestamp float-left">
                  23 Jan 6:10 pm
                </span>
              </div>
              {/* /.direct-chat-infos */}

              {/* /.direct-chat-img */}
              <div className="direct-chat-text">I would love to.</div>
              {/* /.direct-chat-text */}
            </div>
            {/* /.direct-chat-msg */}
          </div>
          {/*/.direct-chat-messages*/}
          {/* Contacts are loaded here */}
          <div className="direct-chat-contacts">
            <ul className="contacts-list">
              <li>
                <a href="/">
                  <div className="contacts-list-info">
                    <span className="contacts-list-name">
                      Count Dracula
                      <small className="contacts-list-date float-right">
                        2/28/2015
                      </small>
                    </span>
                    <span className="contacts-list-msg">
                      How have you been? I was...
                    </span>
                  </div>
                  {/* /.contacts-list-info */}
                </a>
              </li>
              {/* End Contact Item */}
              <li>
                <a href="/">
                  <div className="contacts-list-info">
                    <span className="contacts-list-name">
                      Sarah Doe
                      <small className="contacts-list-date float-right">
                        2/23/2015
                      </small>
                    </span>
                    <span className="contacts-list-msg">
                      I will be waiting for...
                    </span>
                  </div>
                  {/* /.contacts-list-info */}
                </a>
              </li>
              {/* End Contact Item */}
              <li>
                <a href="/">
                  <div className="contacts-list-info">
                    <span className="contacts-list-name">
                      Nadia Jolie
                      <small className="contacts-list-date float-right">
                        2/20/2015
                      </small>
                    </span>
                    <span className="contacts-list-msg">
                      I'll call you back at...
                    </span>
                  </div>
                  {/* /.contacts-list-info */}
                </a>
              </li>
              {/* End Contact Item */}
              <li>
                <a href="/">
                  <div className="contacts-list-info">
                    <span className="contacts-list-name">
                      Nora S. Vans
                      <small className="contacts-list-date float-right">
                        2/10/2015
                      </small>
                    </span>
                    <span className="contacts-list-msg">
                      Where is your new...
                    </span>
                  </div>
                  {/* /.contacts-list-info */}
                </a>
              </li>
              {/* End Contact Item */}
              <li>
                <a href="/">
                  <div className="contacts-list-info">
                    <span className="contacts-list-name">
                      John K.
                      <small className="contacts-list-date float-right">
                        1/27/2015
                      </small>
                    </span>
                    <span className="contacts-list-msg">
                      Can I take a look at...
                    </span>
                  </div>
                  {/* /.contacts-list-info */}
                </a>
              </li>
              {/* End Contact Item */}
              <li>
                <a href="/">
                  <div className="contacts-list-info">
                    <span className="contacts-list-name">
                      Kenneth M.
                      <small className="contacts-list-date float-right">
                        1/4/2015
                      </small>
                    </span>
                    <span className="contacts-list-msg">
                      Never mind I found...
                    </span>
                  </div>
                  {/* /.contacts-list-info */}
                </a>
              </li>
              {/* End Contact Item */}
            </ul>
            {/* /.contacts-list */}
          </div>
          {/* /.direct-chat-pane */}
        </div>
        {/* /.card-body */}
        <div className="card-footer">
          <form action="#" method="post">
            <div className="input-group">
              <input
                type="text"
                name="message"
                placeholder="Type Message ..."
                className="form-control"
              />
              <span className="input-group-append">
                <button type="button" className="btn btn-primary">
                  Send
                </button>
              </span>
            </div>
          </form>
        </div>
        {/* /.card-footer*/}
      </div>
      {/*/.direct-chat */}
      {/* TO DO List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="ion ion-clipboard mr-1" />
            To Do List
          </h3>
          <div className="card-tools">
            <ul className="pagination pagination-sm">
              <li className="page-item">
                <a href="/" className="page-link">
                  «
                </a>
              </li>
              <li className="page-item">
                <a href="/" className="page-link">
                  1
                </a>
              </li>
              <li className="page-item">
                <a href="/" className="page-link">
                  2
                </a>
              </li>
              <li className="page-item">
                <a href="/" className="page-link">
                  3
                </a>
              </li>
              <li className="page-item">
                <a href="/" className="page-link">
                  »
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* /.card-header */}
        <div className="card-body">
          <ul className="todo-list" data-widget="todo-list">
            <li>
              {/* drag handle */}
              <span className="handle">
                <i className="fas fa-ellipsis-v" />
                <i className="fas fa-ellipsis-v" />
              </span>
              {/* checkbox */}
              <div className="icheck-primary d-inline ml-2">
                <input
                  type="checkbox"
                  defaultValue
                  name="todo1"
                  id="todoCheck1"
                />
                <label htmlFor="todoCheck1" />
              </div>
              {/* todo text */}
              <span className="text">Design a nice theme</span>
              {/* Emphasis label */}
              <small className="badge badge-danger">
                <i className="far fa-clock" /> 2 mins
              </small>
              {/* General tools such as edit or delete*/}
              <div className="tools">
                <i className="fas fa-edit" />
                <i className="fas fa-trash-o" />
              </div>
            </li>
            <li>
              <span className="handle">
                <i className="fas fa-ellipsis-v" />
                <i className="fas fa-ellipsis-v" />
              </span>
              <div className="icheck-primary d-inline ml-2">
                <input
                  type="checkbox"
                  defaultValue
                  name="todo2"
                  id="todoCheck2"
                  defaultChecked
                />
                <label htmlFor="todoCheck2" />
              </div>
              <span className="text">Make the theme responsive</span>
              <small className="badge badge-info">
                <i className="far fa-clock" /> 4 hours
              </small>
              <div className="tools">
                <i className="fas fa-edit" />
                <i className="fas fa-trash-o" />
              </div>
            </li>
            <li>
              <span className="handle">
                <i className="fas fa-ellipsis-v" />
                <i className="fas fa-ellipsis-v" />
              </span>
              <div className="icheck-primary d-inline ml-2">
                <input
                  type="checkbox"
                  defaultValue
                  name="todo3"
                  id="todoCheck3"
                />
                <label htmlFor="todoCheck3" />
              </div>
              <span className="text">Let theme shine like a star</span>
              <small className="badge badge-warning">
                <i className="far fa-clock" /> 1 day
              </small>
              <div className="tools">
                <i className="fas fa-edit" />
                <i className="fas fa-trash-o" />
              </div>
            </li>
            <li>
              <span className="handle">
                <i className="fas fa-ellipsis-v" />
                <i className="fas fa-ellipsis-v" />
              </span>
              <div className="icheck-primary d-inline ml-2">
                <input
                  type="checkbox"
                  defaultValue
                  name="todo4"
                  id="todoCheck4"
                />
                <label htmlFor="todoCheck4" />
              </div>
              <span className="text">Let theme shine like a star</span>
              <small className="badge badge-success">
                <i className="far fa-clock" /> 3 days
              </small>
              <div className="tools">
                <i className="fas fa-edit" />
                <i className="fas fa-trash-o" />
              </div>
            </li>
            <li>
              <span className="handle">
                <i className="fas fa-ellipsis-v" />
                <i className="fas fa-ellipsis-v" />
              </span>
              <div className="icheck-primary d-inline ml-2">
                <input
                  type="checkbox"
                  defaultValue
                  name="todo5"
                  id="todoCheck5"
                />
                <label htmlFor="todoCheck5" />
              </div>
              <span className="text">
                Check your messages and notifications
              </span>
              <small className="badge badge-primary">
                <i className="far fa-clock" /> 1 week
              </small>
              <div className="tools">
                <i className="fas fa-edit" />
                <i className="fas fa-trash-o" />
              </div>
            </li>
            <li>
              <span className="handle">
                <i className="fas fa-ellipsis-v" />
                <i className="fas fa-ellipsis-v" />
              </span>
              <div className="icheck-primary d-inline ml-2">
                <input
                  type="checkbox"
                  defaultValue
                  name="todo6"
                  id="todoCheck6"
                />
                <label htmlFor="todoCheck6" />
              </div>
              <span className="text">Let theme shine like a star</span>
              <small className="badge badge-secondary">
                <i className="far fa-clock" /> 1 month
              </small>
              <div className="tools">
                <i className="fas fa-edit" />
                <i className="fas fa-trash-o" />
              </div>
            </li>
          </ul>
        </div>
        {/* /.card-body */}
        <div className="card-footer clearfix">
          <button type="button" className="btn btn-info float-right">
            <i className="fas fa-plus" /> Add item
          </button>
        </div>
      </div>
      {/* /.card */}
    </section>
  );
};

export default MainSection;
