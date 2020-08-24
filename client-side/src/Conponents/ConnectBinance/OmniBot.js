import React from "react";

const OmniBot = ({ botName, stylist, strategy }) => {
  return (
    <div className="col-lg-3 col-6">
      <div className={stylist}>
        <div className="inner">
          <h5>{botName} Status: </h5>
          <p>{strategy}</p>
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
