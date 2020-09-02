import React, { createContext, useState, useMemo } from "react";

export const WhaleContext = createContext();

const WhaleContextProvider = ({ children }) => {
  const [whale, setWhale] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const contextValues = useMemo(
    () => ({
      whale,
      setWhale,
      transaction,
      setTransaction,
    }),
    [whale, transaction]
  );
  return (
    <WhaleContext.Provider value={contextValues}>
      {children}
    </WhaleContext.Provider>
  );
};

export default WhaleContextProvider;
