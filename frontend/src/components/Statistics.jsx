import React, { useState, useEffect } from 'react';

const Statistics = ({ selectedMonth }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });
  const [loading, setLoading] = useState(true);

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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Statistics - {selectedMonth}</h2>
        <div className="animate-pulse">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Statistics - {selectedMonth}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sales Card */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex flex-col">
              <span className="text-blue-600 text-sm font-medium mb-2">Total Sale Amount</span>
              <span className="text-3xl font-bold text-blue-900">
                ${stats.totalSaleAmount?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Sold Items Card */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex flex-col">
              <span className="text-green-600 text-sm font-medium mb-2">Total Sold Items</span>
              <span className="text-3xl font-bold text-green-900">
                {stats.totalSoldItems?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Not Sold Items Card */}
          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex flex-col">
              <span className="text-red-600 text-sm font-medium mb-2">Total Not Sold Items</span>
              <span className="text-3xl font-bold text-red-900">
                {stats.totalNotSoldItems?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Average Sale Amount
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  ${(stats.totalSaleAmount / (stats.totalSoldItems || 1)).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Total Items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {(stats.totalSoldItems + stats.totalNotSoldItems).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Sale Success Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {((stats.totalSoldItems / (stats.totalSoldItems + stats.totalNotSoldItems)) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;