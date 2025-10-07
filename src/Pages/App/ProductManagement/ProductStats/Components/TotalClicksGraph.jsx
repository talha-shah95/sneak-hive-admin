import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TotalClicksGraph = ({ clicksData, xAxisLabel = 'Time Period' }) => {
  const [datatoShow, setDatatoShow] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (clicksData) {
      const labels = clicksData.labels;
      const dataLocal = clicksData.data;
      const data = {
        labels,
        datasets: [
          {
            // Dataset label (hidden since we disabled legend)
            label: 'Total Clicks',
            data: dataLocal,
            backgroundColor: '#96C0FF',
            borderRadius: 99,
            borderSkipped: false,
            categoryPercentage: 0.8,
            barPercentage: 0.7,
            maxBarThickness: 25,
          },
        ],
      };
      setDatatoShow(data);
      setOptions({
        responsive: true,
        maintainAspectRatio: true,
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
              text: 'Clicks',
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
  }, [clicksData]);

  return (
    <div className="total-users-graph">
      {datatoShow && <Bar data={datatoShow} options={options} />}
    </div>
  );
};

export default TotalClicksGraph;
