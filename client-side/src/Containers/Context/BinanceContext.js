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
  const { watchlist, setWatchlist, setMovingAverage, setCoin, setLeaderboard } =
    useContext(CoinContext);
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
      let response = await fetch(`http://localhost:3001/binance/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log("watchlist foo bar", response);
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
  // topleaderboard func call
  const callLeaderboard = useCallback(async () => {
    console.log("inside leaderboard call");
    const endpoint = "callleaderboard";
    try {
      let response = await fetch(`http://localhost:3001/binance/${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const jsonResponse = await response.json();
        // //sort leaderboard based on pnl
        // const sortedLeaderboard = jsonResponse.data.sort(
        //   (a, b) => b.pnl - a.pnl
        // );
        const topLeaderboard = jsonResponse.data.slice(0, 12);
        topLeaderboard.unshift(
          {
            encryptedUid: "DF74DFB6CB244F8033F1D66D5AA0B171",
            nickName: "TreeOfAlpha2",
          },
          {
            encryptedUid: "FB23E1A8B7E2944FAAEC6219BBDF8243",
            nickName: "TreeOfAlpha1",
          },
          {
            encryptedUid: "3BAFAFCA68AB85929DF777C316F18C54",
            nickName: "Anonymous User-c1d8018",
          },
          {
            encryptedUid: "0A927BE36D0CC5011A99501232781AFA",
            nickName: "constant4",
          },
          {
            encryptedUid: "FE63D6040E22611D978B73064B3A2057",
            nickName: "constant1",
          }
        );
        console.log("leaderboard", topLeaderboard);
        setLeaderboard(topLeaderboard);
      }
    } catch (e) {
      console.log("calling binnance error ", e);
    }
  }, [setLeaderboard]);

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
        console.log("balance", jsonResponse);
        for (let property in jsonResponse) {
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
      callLeaderboard,
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
