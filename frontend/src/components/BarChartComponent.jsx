import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartComponent = ({ selectedMonth = 'March' }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bar-chart?month=${selectedMonth}`);
      const data = await response.json();
      
      setChartData({
        labels: data.map(item => item.range),
        datasets: [{
          label: 'Number of Items',
          data: data.map(item => item.count),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1
        }]
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
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
        text: `Price Range Distribution - ${selectedMonth}`
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default BarChartComponent;