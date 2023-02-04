var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

async function scrape() {
  const response = await axios.get(
    "https://www.cftc.gov/dea/futures/deacmesf.htm"
  );
  const html = response.data;

  const startIndex = html.indexOf("BITCOIN - CHICAGO MERCANTILE EXCHANGE");
  const endIndex = html.indexOf("SOFR-3M", startIndex);
  const data = html.substring(startIndex, endIndex);
  return data;
}

router.get("/callcmereport", (req, res, next) => {
  const checkAccountBalance = async () => {
    const data = await scrape();
    res.json(data);
  };
  checkAccountBalance();
});
// *************************************
// end binance api
module.exports = router;
