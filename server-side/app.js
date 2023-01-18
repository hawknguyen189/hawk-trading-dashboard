var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var whaleRouter = require("./routes/whalehunter");
var binanceRouter = require("./routes/binance");
var graphqlRouter = require("./routes/graphql");
let utilFunction = require("./utils/HelpfulFunction");
var app = express();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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
// app.use("/whalehunter", whaleRouter);

app.use("/binance", binanceRouter);
app.use("/graphql", graphqlRouter);
app.get("/foobar", (req, res, next) => {
  const checkFooBar = async () => {
    const response = await fetch(
      "https://be.blackeyegalaxy.space/v1/get-available-asteroids?source=141&spaceship=2061&sourcetype=0"
    );
    // console.log("respone", response);
    console.log("respone", await response.json());
    res.json(checkFooBar);
  };
  checkFooBar();
});
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
