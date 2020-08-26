import React, { useContext, useEffect, useState } from "react";
import { BotContext } from "../../Containers/Context/BotContext";

const BotController = ({ stylist }) => {
  const { bot, setBot } = useContext(BotContext);
  const [botInfo, setBotInfo] = useState("");

  return (
    <div className="col-lg-3 col-6">
      <div className={stylist}>
        <div className="inner">Hello I'm the big boss</div>
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
export default BotController;
