import React, { createContext, useState, useMemo } from "react";

export const BotContext = createContext();

const BotContextProvider = ({ children }) => {
  const localKiwi = localStorage.getItem("botkiwi")
    ? JSON.parse(localStorage.getItem("botkiwi"))
    : {
        botkiwi: {
          status: "vacant",
          fund: 1000,
          offline: false,
          model: "SMA",
        },
      };
  const localHawk = localStorage.getItem("bothawk")
    ? JSON.parse(localStorage.getItem("bothawk"))
    : {
        bothawk: {
          status: "vacant",
          fund: 1000,
          offline: false,
          model: "SPOTMA",
        },
      };
  const localSusi = localStorage.getItem("botsusi")
    ? JSON.parse(localStorage.getItem("botsusi"))
    : {
        botsusi: {
          status: "vacant",
          fund: 1000,
          offline: false,
          model: "EMA",
        },
      };
  const btcWatchdog = localStorage.getItem("btcwatchdog")
    ? JSON.parse(localStorage.getItem("btcwatchdog"))
    : {
        btcwatchdog: {
          status: "scouting",
          fund: 666,
          offline: false,
          model: "WATCHDOG",
        },
      };

  const initialState = {
    ...localKiwi,
    ...localHawk,
    ...localSusi,
    ...btcWatchdog,
  };
  const [bot, setBot] = useState(initialState);
  const [pause, setPause] = useState(false);
  const contextValues = useMemo(
    () => ({
      bot,
      setBot,
      pause,
      setPause,
    }),
    [bot, pause]
  );
  return (
    <BotContext.Provider value={contextValues}>{children}</BotContext.Provider>
  );
};

export default BotContextProvider;
