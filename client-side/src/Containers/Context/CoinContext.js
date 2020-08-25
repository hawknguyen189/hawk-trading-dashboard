import React, { createContext, useState, useMemo } from "react";

export const CoinContext = createContext();

const CoinContextProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]); //top 10 volume coin
  const [coin, setCoin] = useState(""); //all coin price
  const [movingAverage, setMovingAverage] = useState(""); //moving average
  // use useMemo to memoise the value and refresh only when one of these values change.
  const contextValues = useMemo(
    () => ({
      watchlist,
      setWatchlist,
      coin,
      setCoin,
      movingAverage,
      setMovingAverage,
    }),
    [watchlist, coin, movingAverage]
  );
  return (
    <CoinContext.Provider value={contextValues}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
