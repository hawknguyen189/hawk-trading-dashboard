import React, { createContext, useState, useMemo } from "react";

export const CoinContext = createContext();

const CoinContextProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  // use useMemo to memoise the value and refresh only when one of these values change.
  const contextValues = useMemo(
    () => ({
      watchlist,
      setWatchlist,
    }),
    [watchlist]
  );
  return (
    <CoinContext.Provider value={contextValues}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;
