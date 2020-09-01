import React, { createContext, useState, useMemo } from "react";

export const BotContext = createContext();

const BotContextProvider = ({ children }) => {
  const localKiwi = localStorage.getItem("botkiwi")
    ? JSON.parse(localStorage.getItem("botkiwi"))
    : {
        botkiwi: {
          status: "vacant",
          fund: 1000,
          offline: true,
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
          status: "vacant",
          fund: 1000,
          offline: false,
          model: "WATCHDOG",
        },
      };
  const ethWatchdog = localStorage.getItem("ethwatchdog")
    ? JSON.parse(localStorage.getItem("ethwatchdog"))
    : {
        ethwatchdog: {
          status: "vacant",
          fund: 1000,
          offline: false,
          model: "WATCHDOG",
          offline: false,
          model:"SMLMA"
        },
      };
  const localHao = localStorage.getItem("bothao")
    ? JSON.parse(localStorage.getItem("bothao"))
    : {
      bothao: {
          status: "vacant",
          fund: 1000,
          offline: false,
          model: "EMAp",
        },
      };
  const localMilo = localStorage.getItem("botmilo")
    ? JSON.parse(localStorage.getItem("botmilo"))
    : {
        botmilo: {
          status: "vacant",
          fund: 1000,
          offline: false,
          model:"RM"
        },
      };
  const localCeci = localStorage.getItem("botceci")
    ? JSON.parse(localStorage.getItem("botceci"))
    : {
        botceci: {
          status: "vacant",
          fund: 1000,
          offline: false,
          model:"RD"
        },
      };

  const initialState = {
    ...localKiwi,
    ...localHawk,
    ...localSusi,
    ...localHao,
    ...localMilo,
    ...localCeci,
    ...btcWatchdog,
    ...ethWatchdog,
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
