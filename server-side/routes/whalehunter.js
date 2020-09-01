var express = require("express");
var router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const api = require("etherscan-api").init(process.env.ETHERSCAN_API);
const Decimal = require("decimal.js");
/* GET home page. */
router.get("/balance", function (req, res, next) {
  console.log("whale balance ");
  const checkAddress = "0x39979745B166572c25b4c7e4e0939c9298EFE79D";
  const endpoint = `https://api.ethplorer.io/getAddressInfo/${checkAddress}?apiKey=${process.env.ETHER_EXPLORER_API}`;
  let addressInfo = [];
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
  axios
    .get(endpoint)
    .then((response) => {
      addressInfo.push({
        symbol: "ETH",
        name: "Ethereum",
        address: "Ethereum",
        balance: response.data.ETH.balance,
        currentPrice: response.data.ETH.price.rate,
        totalValue: parseFloat(
          response.data.ETH.balance * response.data.ETH.price.rate
        ).toFixed(4),
      });
      response.data.tokens.forEach((element) => {
        //   work on reformating balance
        const balance = getFormattedTokenBalance(element);
        const price = element.tokenInfo.price.rate
          ? element.tokenInfo.price.rate
          : 0;
        if (element.tokenInfo.symbol) {
          addressInfo.push({
            symbol: element.tokenInfo.symbol,
            name: element.tokenInfo.name,
            address: element.tokenInfo.address,
            balance: balance,
            currentPrice: price,
            totalValue: parseFloat(balance * price).toFixed(4),
          });
        }
      });
      const responseArray = addressInfo.sort(
        (a, b) => b.totalValue - a.totalValue
      );
      res.json(responseArray);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
