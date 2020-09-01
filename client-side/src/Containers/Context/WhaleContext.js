import React, { createContext, useState, useMemo } from "react";

export const WhaleContext = createContext();

const WhaleContextProvider = ({ children }) => {
  const [whale, setWhale] = useState([]);
  const contextValues = useMemo(
    () => ({
      whale,
      setWhale,
    }),
    [whale]
  );
  return (
    <WhaleContext.Provider value={contextValues}>
      {children}
    </WhaleContext.Provider>
  );
};

export default WhaleContextProvider;
