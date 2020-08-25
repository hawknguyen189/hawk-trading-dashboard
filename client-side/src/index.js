import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CoinContextProvider from "./Containers/Context/CoinContext";
import BotContextProvider from "./Containers/Context/BotContext";
import UserAccountProvider from "./Containers/Context/UserAccount";

ReactDOM.render(
  <UserAccountProvider>
    <CoinContextProvider>
      <BotContextProvider>
        <App />
      </BotContextProvider>
    </CoinContextProvider>
  </UserAccountProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
