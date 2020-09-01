var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Binance = require("node-binance-api");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var whaleRouter = require("./routes/whalehunter");
let utilFunction = require("./utils/HelpfulFunction");
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
app.use("/whalehunter", whaleRouter);

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
  console.log("here is the watchlist call");
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

app.post("/checkorder", (req, res, next) => {
  //check bid  & ask order
  const symbol = req.body.symbol;
  binance.bookTickers(symbol, (error, ticker) => {
    res.json(ticker);
  });
  // res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
  // res.end("yes");
});

app.post("/callklinedata", (req, res, next) => {
  const watchlist = [...req.body];
  let resArray = [];
  const checkKlineData = async (market, period) => {
    // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    // const market = "IOTAUSDT";
    await binance.candlesticks(
      market,
      "1m",
      (error, ticks, symbol) => {
        // let last_tick = ticks[ticks.length - 1];
        // let [
        //   time,
        //   open,
        //   high,
        //   low,
        //   close,
        //   volume,
        //   closeTime,
        //   assetVolume,
        //   trades,
        //   buyBaseVolume,
        //   buyAssetVolume,
        //   ignored,
        // ] = last_tick;

        // work on latest element for SPA purpose
        //array.slice selected from start index to end index (end not included)
        const latest30Array = ticks.slice(ticks.length - 30, ticks.length);
        const result30SMA = latest30Array.reduce((acc, curr) => {
            // if (i === period - 1) arr.splice(1); // eject early by mutating iterated copy
            return acc + parseFloat(curr[4]);
          }, 0);
        const period10Array = ticks.slice(ticks.length - 10, ticks.length);
        const result10SMA = period10Array.reduce((acc, curr) => {
            // if (i === period - 1) arr.splice(1); // eject early by mutating iterated copy
            return acc + parseFloat(curr[4]);
          }, 0);
        const res30EMA = latest30Array.reduce((acc, curr, index) => {
            // if (i === period - 1) arr.splice(1); // eject early by mutating iterated copy
            return acc + parseFloat(curr[4] * 2 / (index + 2));
          }, 0);
        const quotien30EMA = latest30Array.reduce((acc, curr, index) => {
          // if (i === period - 1) arr.splice(1); // eject early by mutating iterated copy
          return acc + parseFloat(2 / (index + 2));
        }, 0);
        const period5Array = ticks.slice(ticks.length - 5, ticks.length);
        const result5SMA = period5Array
          // .slice(0) // create copy of "array" for iterating
          .reduce((acc, curr) => {
            // if (i === period - 1) arr.splice(1); // eject early by mutating iterated copy
            return acc + parseFloat(curr[4]);
          }, 0);
        const result5EMA = period5Array.reduce((acc, curr, index) => {
          // if (i === period - 1) arr.splice(1); // eject early by mutating iterated copy
          return acc + parseFloat(curr[4] * 2 / (index + 2));
        }, 0);
        const quotien5EMA = period5Array.reduce((acc, curr, index) => {
          // if (i === period - 1) arr.splice(1); // eject early by mutating iterated copy
          return acc + parseFloat(2 / (index + 2));
        }, 0);
        const periodArray = ticks.slice(ticks.length - 7, ticks.length);
        const result7SMA = periodArray.reduce((acc, curr) => {
          return acc + parseFloat(curr[4]);
        }, 0);
        // resArray.push({ [market]: result.toFixed(2) / period });

        //working on EMA
        // ***************
        const initial7Array = ticks.slice(0, 7);
        const rest7Array = ticks.slice(7, ticks.length);
        const initial30Array = ticks.slice(0, 30);
        const rest30Array = ticks.slice(30, ticks.length);
        //calculate first 30 SMA for initial EMA
        const initial30EMA =
          initial30Array.reduce((acc, curr) => {
            return acc + parseFloat(curr[4]);
          }, 0) / initial30Array.length;
        const initial7EMA =
          initial7Array.reduce((acc, curr) => {
            return acc + parseFloat(curr[4]);
          }, 0) / initial7Array.length;

        //calculate latest EMA
        const result30EMA = rest30Array.reduce((acc, curr) => {
          return (parseFloat(curr[4]) - acc) * (2 / 31) + acc;
        }, initial30EMA);
        const result7EMA = rest7Array.reduce((acc, curr) => {
          return (parseFloat(curr[4]) - acc) * (2 / 8) + acc;
        }, initial7EMA);
        resArray.push({
          symbol: market,
          SMA5: (result5SMA / 5).toFixed(4),
          SMA7: (result7SMA / 7).toFixed(4),
          EMA5: (result5EMA / quotien5EMA).toFixed(4),
          SMA10: (result10SMA / 10).toFixed(4),
          SMA30: (result30SMA / 30).toFixed(4),
          EMA7: result7EMA.toFixed(4),
          EMA30p: (res30EMA / quotien30EMA).toFixed(4),
          EMA30: result30EMA.toFixed(4),
        });

        if (resArray.length === watchlist.length) {
          res.json(resArray);
        }
        // modelFunction(period, ticks);
      },
      { limit: 30 }
    );
  };
  const CookAllData = (period) => {
    for (let i = 0; i < watchlist.length; i++) {
      const market = watchlist[i].symbol;
      checkKlineData(market, period);
    }
  };
  CookAllData(7); //SMA 7, SMA 30 automatiaclly
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
