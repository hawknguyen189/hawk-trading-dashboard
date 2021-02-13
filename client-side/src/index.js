import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import BinanceContextProvider from "./Containers/Context/BinanceContext";
import CoinContextProvider from "./Containers/Context/CoinContext";
import BotContextProvider from "./Containers/Context/BotContext";
import UserAccountProvider from "./Containers/Context/UserAccount";
import WhaleContextContext from "./Containers/Context/WhaleContext";

ReactDOM.render(
  <UserAccountProvider>
    <CoinContextProvider>
      <BotContextProvider>
        <BinanceContextProvider>
          <WhaleContextContext>
            <App />
          </WhaleContextContext>
        </BinanceContextProvider>
      </BotContextProvider>
    </CoinContextProvider>
  </UserAccountProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
