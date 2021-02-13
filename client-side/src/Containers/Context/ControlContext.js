import React, { createContext, useState, useMemo } from "react";

export const ControlContext = createContext();

const ControlContextProvider = ({ children }) => {
  const [runInterval, setRunInterval] = useState(false); //top 10 volume coin
  // use useMemo to memoise the value and refresh only when one of these values change.
  const contextValues = useMemo(
    () => ({
      runInterval,
      setRunInterval,
    }),
    [runInterval]
  );
  return (
    <ControlContext.Provider value={contextValues}>
      {children}
    </ControlContext.Provider>
  );
};

export default ControlContextProvider;
