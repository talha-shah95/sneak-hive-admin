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

const TotalEarningGraph = ({ earningData, xAxisLabel = 'Time Period' }) => {
  const [datatoShow, setDatatoShow] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (earningData) {
      const labels = earningData.labels;
      const dataLocal = earningData.data;
      const data = {
        labels,
        datasets: [
          {
            // Dataset label (hidden since we disabled legend)
            label: 'Total Earnings',
            data: dataLocal,
            backgroundColor: '#420080',
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
              text: 'Total Earnings ($)',
              color: 'var(--blackColor, #000000)',
            },
            ticks: {
              callback: (value) => `$${value}`,
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
  }, [earningData]);

  return (
    <div className="total-earning-graph">
      {datatoShow && <Bar data={datatoShow} options={options} />}
    </div>
  );
};

export default TotalEarningGraph;
