import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart instance if exists
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // Create a new chart
      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({ length: 72 }, (_, i) => (1950 + i).toString()),
          datasets: [
            {
              label: "Line Chart",
              data: Array.from({ length: 72 }, () => Math.random() * 100),
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Data",
              },
            },
          },
        },
      });
    }
  }, []);

  return <canvas ref={chartRef} />;
};

export default LineChart;
