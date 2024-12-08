import React, { useState, useEffect } from 'react';

const Statistics = ({ selectedMonth }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/statistics?month=${selectedMonth}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Loading statistics...</h2>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-8 rounded-lg">
      <h2 className="text-xl font-bold mb-6">
        Statistics - {selectedMonth} <span className="text-sm font-normal text-gray-500">(Selected Month)</span>
      </h2>
      
      <div className="bg-yellow-100 rounded-lg p-4 max-w-md">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total sale</span>
            <span className="font-medium">${stats.totalSaleAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total sold item</span>
            <span className="font-medium">{stats.totalSoldItems}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total not sold item</span>
            <span className="font-medium">{stats.totalNotSoldItems}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;