import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TotalOrdersGraph = ({ ordersData, xAxisLabel = 'Time Period' }) => {
  const [datatoShow, setDatatoShow] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (ordersData) {
      const labels = ordersData.labels;
      const dataLocal = ordersData.data;

      const data = {
        labels,
        datasets: [
          {
            // Dataset label (hidden since we disabled legend)
            label: 'Total Orders',
            data: dataLocal,
            fill: {
              target: 'origin',
              above: '#e2d9eb',
              below: '#ff0000',
            },
            tension: 0.5,
            borderColor: '#420080',
            pointBorderWidth: 4,
            pointBorderColor: '#420080',
            pointBackgroundColor: '#ffffff',
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#420080',
            pointHoverBorderWidth: 2,
          },
        ],
      };
      setDatatoShow(data);

      setOptions({
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Orders',
              color: 'var(--blackColor, #000000)',
            },
            ticks: {
              callback: (value) => `${value}`,
              color: 'var(--blackColor, #000000)',
            },
          },
          x: {
            title: {
              display: true,
              text: xAxisLabel,
              color: 'var(--blackColor, #000000)',
            },
            ticks: {
              color: 'var(--blackColor, #000000)',
            },
          },
        },
      });
    }
  }, [ordersData  ]);

  return (
    <div className="total-earning-graph">
      {datatoShow && <Line data={datatoShow} options={options} />}
    </div>
  );
};

export default TotalOrdersGraph;
