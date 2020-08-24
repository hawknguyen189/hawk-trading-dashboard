var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Binance = require("node-binance-api");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// body-parser to parse parameters sent by the frontend, and cors to allow requests coming from another server or a different port of the same server.
const cors = require("cors");
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/binance", (req, res, next) => {
  console.log("start new app use for bitcoin only");
  next();
});

// setting up binance API
// *****************************************
const dotenv = require("dotenv");
dotenv.config();
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API,
  APISECRET: process.env.BINANCE_APISECRET,
  useServerTime: true,
});
app.get("/callwatchlist", (req, res, next) => {
  console.log("here is the get response");
  // const checkAllPrice = async () => {
  //   let response = await binance.prices();
  //   console.info(`Price of BNB: ${response.BNBUSDT}`);
  //   res.status("200").send(response);
  // };
  // checkPrice();
  const checkAllVolume = async () => {
    await binance.exchangeInfo(function (lim) {
      console.log("here is your API limit ", lim);
    });
    await binance.prevDay(false, (error, prevDay) => {
      // console.info(prevDay); // view all data
      res.json(prevDay);
    });
    // console.info(response); // view all data
  };
  checkAllVolume();
});
app.get("/callaccountbalance", (req, res, next) => {
  const checkAccountBalance = async () => {
    await binance.useServerTime();
    await binance.exchangeInfo(function (lim) {
      console.log("here is your API limit inside account balance ", lim);
    });
    binance.balance((error, balances) => {
      if (error) return console.error(error);
      console.info("ETH balance: ", balances.ETH.available);
      res.json(balances);
    });
  };
  checkAccountBalance();
});
app.get("/callcheckprice", (req, res, next) => {
  const checkPrice = async () => {
    let ticker = await binance.prices();
    res.json(ticker);
  };
  checkPrice();
});
app.get("/callklinedata", (req, res, next) => {
  const checkKlineData = async () => {
    // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    const market = "IOTAUSDT";
    binance.candlesticks(
      market,
      "1m",
      (error, ticks, symbol) => {
        let last_tick = ticks[ticks.length - 1];
        let [
          time,
          open,
          high,
          low,
          close,
          volume,
          closeTime,
          assetVolume,
          trades,
          buyBaseVolume,
          buyAssetVolume,
          ignored,
        ] = last_tick;
        res.json(ticks);
      },
      { limit: 30}
    );
  };
  checkKlineData();
});

app.post("/login", (req, res, next) => {
  console.log(req.body);
  var user_name = req.body.headers;
  var password = req.body.method;
  console.log("User name = " + user_name + ", password is " + password);
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
  // res.end("yes");
});
// *************************************
// end binance api

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
