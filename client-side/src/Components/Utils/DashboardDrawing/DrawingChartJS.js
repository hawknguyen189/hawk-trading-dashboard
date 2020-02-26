import React, { useEffect } from "react";
import Chart from "chart.js";

const DrawingChartJS = props => {
  let chartRef = React.createRef();
  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");

    new Chart(myChartRef, {
      type: props.type,
      data: props.data,
      options: props.option
    });
  });

  return <canvas className="drawing-chart-js" height={props.height} ref={chartRef} />;
};
export default DrawingChartJS;
