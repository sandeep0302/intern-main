import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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

const BarChartComponent = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/bar-chart?month=${selectedMonth}`);
      const data = await response.json();
      
      setChartData({
        labels: data.map(item => item.range),
        datasets: [
          {
            data: data.map(item => item.count),
            backgroundColor: '#40E0D0',
            borderRadius: 4,
            barThickness: 30
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB'
        },
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Loading chart...</h2>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-8 rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        Bar Chart Stats - {selectedMonth}{' '}
        <span className="text-sm font-normal text-gray-500">
          (Selected Month)
        </span>
      </h2>
      
      <div className="h-[400px] mt-4">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChartComponent;