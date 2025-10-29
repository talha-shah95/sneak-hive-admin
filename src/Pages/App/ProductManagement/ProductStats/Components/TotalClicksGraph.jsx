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
    if (!clicksData) {
      setDatatoShow(null);
      setOptions(null);
      return;
    }

    const isArrayData = Array.isArray(clicksData);
    const rawLabels = isArrayData
      ? null
      : clicksData?.labels ?? clicksData?.months;
    const rawData = isArrayData
      ? clicksData
      : clicksData?.data ?? clicksData?.values;

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

    const finalLabels =
      Array.isArray(rawLabels) && rawLabels.length === finalData.length
        ? rawLabels
        : fallbackLabels;

    const hasPoints = finalData.length > 0 && finalLabels.length > 0;

    if (!hasPoints) {
      setDatatoShow(null);
      setOptions(null);
      return;
    }

    const data = {
      labels: finalLabels,
      datasets: [
        {
          // Dataset label (hidden since we disabled legend)
          label: 'Total Clicks',
          data: finalData,
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
  }, [clicksData, xAxisLabel]);

  return (
    <div className="total-users-graph">
      {datatoShow && options && <Bar data={datatoShow} options={options} />}
    </div>
  );
};

export default TotalClicksGraph;
