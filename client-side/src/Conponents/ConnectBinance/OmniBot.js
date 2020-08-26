import React, { useContext, useEffect, useState } from "react";
import { BotContext } from "../../Containers/Context/BotContext";

const OmniBot = ({ botName, stylist }) => {
  const { bot, setBot } = useContext(BotContext);
  const [botInfo, setBotInfo] = useState("");
  useEffect(() => {
    if (bot) {
      for (let property in bot) {
        if (property === botName) {
          setBotInfo(bot[property]);
        }
      }
    }
  }, [bot]);
  return (
    <div className="col-lg-3 col-6">
      <div className={stylist}>
        <div className="inner">
          {botInfo && (
            <div>
              <h5>
                {botName} - {botInfo.offline ? "Offline" : "Online"} Status :{" "}
                {botInfo.status}
              </h5>
              <p>{botInfo.model}</p>
              <p>Total Fund: {botInfo.fund}</p>
              <p>
                {botInfo.holding
                  ? `Bot Holding:  ${botInfo.holding}  @${botInfo.initialPrice}`
                  : ""}
              </p>
            </div>
          )}
        </div>
        <div className="icon">
          <i className="ion ion-bag" />
        </div>
        <a href="/" className="small-box-footer">
          More info <i className="fas fa-arrow-circle-right" />
        </a>
      </div>
    </div>
  );
};
export default OmniBot;
