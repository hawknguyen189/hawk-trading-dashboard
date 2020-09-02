const Decimal = require("decimal.js");

let methods = {};
methods.calculateSMA = function (period, data) {
  console.log(
    "Current Time in Unix Timestamp: " + Math.floor(Date.now() / 1000)
  );
};

function getFormattedTokenBalance(tokenData) {
  // const num = new Decimal(tokenData.balance).toFixed();
  // const decimalPos = num.length - tokenData.tokenInfo.decimals;
  // const formattedBalance = `${num.slice(0, decimalPos)}.${num.slice(
  //   decimalPos
  // )}`;
  // return formattedBalance;
  const num = new Decimal(tokenData.balance).toFixed();
  const decimalPos = num.length - tokenData.tokenInfo.decimals;
  let formattedBalance;
  if (decimalPos >= 0) {
    formattedBalance = `${num.slice(0, decimalPos)}.${num.slice(decimalPos)}`;
  } else {
    //for small amount
    let initialNum = "0.";
    for (let i = 0; i <= decimalPos; i--) {
      initialNum.concat("0");
    }
    formattedBalance = `${initialNum}${num}`;
  }
  return formattedBalance;
}
module.exports = { methods, getFormattedTokenBalance };
