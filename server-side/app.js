var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//add mongodb file
require("./db");

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

app.get("/url", (req, res, next) => {
  console.log("here is the get response");
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.post("/login", (req, res, next) => {
  console.log(req.body);
  var user_name = req.body.headers;
  var password = req.body.method;
  console.log("User name = " + user_name + ", password is " + password);
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
  // res.end("yes");
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
