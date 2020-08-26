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
          offline: true,
          model:"SPOTMA"
        },
      };
  const localSusi = localStorage.getItem("botsusi")
    ? JSON.parse(localStorage.getItem("botsusi"))
    : {
        botsusi: {
          status: "vacant",
          fund: 1000,
          offline: true,
          model:"EMA"
        },
      };

  const initialState = {
    ...localKiwi,
    ...localHawk,
    ...localSusi,
  };
  const [bot, setBot] = useState(initialState);
  const contextValues = useMemo(
    () => ({
      bot,
      setBot,
    }),
    [bot]
  );
  return (
    <BotContext.Provider value={contextValues}>{children}</BotContext.Provider>
  );
};

export default BotContextProvider;
