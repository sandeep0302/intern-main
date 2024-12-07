import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChartComponent = ({ selectedMonth = 'March' }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchPieChartData();
  }, [selectedMonth]);

  const fetchPieChartData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pie-chart?month=${selectedMonth}`);
      const data = await response.json();

      // Generate random colors for each category
      const backgroundColors = data.map(() => 
        `hsla(${Math.random() * 360}, 70%, 50%, 0.6)`
      );

      setChartData({
        labels: data.map(item => item.category),
        datasets: [{
          data: data.map(item => item.count),
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1
        }]
      });
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Category Distribution - ${selectedMonth}`
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Pie options={options} data={chartData} />
    </div>
  );
};

export default PieChartComponent;