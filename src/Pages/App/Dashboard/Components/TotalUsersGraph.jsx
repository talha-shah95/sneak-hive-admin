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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TotalUsersGraph = ({ usersData, xAxisLabel = 'Time Period' }) => {
  const [datatoShow, setDatatoShow] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (!usersData) {
      setDatatoShow(null);
      return;
    }

    const isArrayData = Array.isArray(usersData);
    const rawLabels = isArrayData ? null : usersData?.labels ?? usersData?.months;
    const rawData = isArrayData ? usersData : usersData?.data ?? usersData?.values;

    const finalData = Array.isArray(rawData) ? rawData : [];
    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const fallbackLabels = (() => {
      if (finalData.length === 12) {
        return monthLabels;
      }

      if (finalData.length && finalData.length <= monthLabels.length) {
        return monthLabels.slice(0, finalData.length);
      }

      return finalData.map((_, index) => `Item ${index + 1}`);
    })();

    const finalLabels = Array.isArray(rawLabels) && rawLabels.length === finalData.length
      ? rawLabels
      : fallbackLabels;

    const hasPoints = finalData.length > 0 && finalLabels.length > 0;

    if (!hasPoints) {
      setDatatoShow(null);
      return;
    }

    const data = {
      labels: finalLabels,
      datasets: [
        {
          label: 'Total Users',
          data: finalData,
          borderColor: '#4A90E2',
          backgroundColor: 'rgba(74, 144, 226, 0.18)',
          pointBackgroundColor: '#4A90E2',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3,
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
        tooltip: {
          intersect: false,
          mode: 'nearest',
        },
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Users',
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
  }, [usersData, xAxisLabel]);
  return (
    <div className="total-users-graph">
      {datatoShow && <Line data={datatoShow} options={options} />}
    </div>
  );
};

export default TotalUsersGraph;
