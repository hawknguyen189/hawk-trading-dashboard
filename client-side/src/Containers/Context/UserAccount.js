import React, { createContext, useState, useMemo } from "react";

export const UserAccount = createContext();

const UserAccountProvider = ({ children }) => {
  const [balance, setBalance] = useState([]);
  const [purchasePrice, setPurchasePrice] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  // use useMemo to memoise the value and refresh only when one of these values change.
  const contextValues = useMemo(
    () => ({
      balance,
      setBalance,
      purchasePrice,
      setPurchasePrice,
      openOrders,
      setOpenOrders,
    }),
    [balance, purchasePrice, openOrders]
  );
  return (
    <UserAccount.Provider value={contextValues}>
      {children}
    </UserAccount.Provider>
  );
};

export default UserAccountProvider;
