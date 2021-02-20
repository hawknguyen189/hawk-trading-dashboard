import React, {
  createContext,
  useState,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { CoinContext } from "./CoinContext";
import { BotContext } from "./BotContext";
import { UserAccount } from "./UserAccount";

export const BinanceContext = createContext();

const BinanceContextProvider = ({ children }) => {
  const [runInterval, setRunInterval] = useState(false);
  const [trailingDown, setTrailingDown] = useState(10);
  const [trailingUp, setTrailingUp] = useState(5);
  const { watchlist, setWatchlist, setMovingAverage, setCoin } = useContext(
    CoinContext
  );
  const { bot } = useContext(BotContext);
  const { setBalance, setOpenOrders } = useContext(UserAccount);

  // use useMemo to memoise the value and refresh only when one of these values change.
  const callKlineData = useCallback(async () => {
    const endpoint = "callklinedata";
    if (watchlist.length) {
      try {
        let response = await fetch(`/binance/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(watchlist), // body data type must match "Content-Type" header
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const jsonResponse = await response.json();
          // const resultParse = JSON.parse(jsonResponse);
          console.log("kline ", jsonResponse);
          setMovingAverage(jsonResponse);
        }
      } catch (e) {
        console.log("calling kline/candlestick error ", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlist]);
  // watchlist func call
  const callWatchlist = useCallback(async () => {
    console.log("inside watchlist call");
    const endpoint = "callwatchlist";
    try {
      let response = await fetch(`/binance/${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        const listUSDT = jsonResponse.filter((e) =>
          e.symbol.includes("USDT", 1)
        );
        const descListUSDT = listUSDT.sort(
          (a, b) => b.quoteVolume - a.quoteVolume
        );
        const top10List = descListUSDT.slice(0, 10);
        //add check function to add holding pair in case out of top 10 vol
        if (bot) {
          for (let property in bot) {
            if (bot[property].holding) {
              const getHoldingData = descListUSDT.find(
                (e) => e.symbol === bot[property].holding
              );
              const checktop10List = top10List.find(
                (e) => e.symbol === getHoldingData.symbol
              );
              if (!checktop10List) {
                top10List.push(getHoldingData);
              }
            }
          }
        }
        //finish adding holding pair
        setWatchlist(top10List);
      }
    } catch (e) {
      console.log("calling binnance error ", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // call account summary func
  const callAccountBalance = useCallback(async () => {
    console.log("call account balance ");
    const endpoint = "callaccountbalance";
    try {
      let response = await fetch(`/binance/${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        // const resultParse = JSON.parse(jsonResponse);
        let mainBalance = [];
        for (let property in jsonResponse) {
          // console.log(parseInt(jsonResponse[property]["onOrder"]));
          if (
            parseInt(jsonResponse[property]["available"]) > 0 ||
            parseInt(jsonResponse[property]["onOrder"]) > 0
          ) {
            mainBalance.push({
              symbol: property,
              ...jsonResponse[property],
            });
          }
        }
        setBalance(mainBalance);
      }
    } catch (e) {
      console.log("calling account balance error ", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // retrieve all open orders
  const callOpenOrders = useCallback(async () => {
    console.log("call open orders ");
    const endpoint = "callopenorders";
    try {
      let response = await fetch(`/binance/${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        // const resultParse = JSON.parse(jsonResponse);
        console.log("open orders", jsonResponse);
        setOpenOrders(jsonResponse);
        // setBalance(mainBalance);
      }
    } catch (e) {
      console.log("calling account balance error ", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const callCheckPrice = useCallback(async () => {
    // console.log("call check price")
    const endpoint = "callcheckprice";
    try {
      let response = await fetch(`/binance/${endpoint}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        // const resultParse = JSON.parse(jsonResponse);
        // let allPrice = [];
        // for (let property in jsonResponse) {
        //   // console.log(parseInt(jsonResponse[property]["onOrder"]));
        //   allPrice.push(property);
        // }
        // console.log("all price ", allPrice);
        setCoin(jsonResponse);
      }
    } catch (e) {
      console.log("calling check all price error ", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const callMarketSell = useCallback(async (symbol) => {
    const endpoint = "callmarketsell";
    try {
      let response = await fetch(`/binance/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(symbol), // body data type must match "Content-Type" header
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        console.log("market sell ", jsonResponse);
      }
    } catch (e) {
      console.log("market sell order error ", e);
    }
  }, []);

  const contextValues = useMemo(
    () => ({
      runInterval,
      setRunInterval,
      callKlineData,
      callWatchlist,
      callAccountBalance,
      callCheckPrice,
      callOpenOrders,
      trailingDown,
      setTrailingDown,
      trailingUp,
      setTrailingUp,
      callMarketSell,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runInterval, trailingDown, trailingUp]
  );
  return (
    <BinanceContext.Provider value={contextValues}>
      {children}
    </BinanceContext.Provider>
  );
};

export default BinanceContextProvider;
