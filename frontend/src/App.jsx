import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';

function App() {
  const [selectedMonth, setSelectedMonth] = useState('March');

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Transaction Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Month Selection Section */}
        <section className="mb-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Month Selection</h2>
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </section>

        {/* Statistics Overview Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Statistics Overview</h2>
          <Statistics selectedMonth={selectedMonth} />
        </section>

        {/* Transactions Table Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Transaction Details</h2>
          <TransactionsTable 
            selectedMonth={selectedMonth} 
            onMonthChange={handleMonthChange} 
          />
        </section>

        {/* Analytics Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Analytics Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart Section */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-600">Price Range Distribution</h3>
              <BarChartComponent selectedMonth={selectedMonth} />
            </div>
            
            {/* Pie Chart Section */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-600">Category Distribution</h3>
              <PieChartComponent selectedMonth={selectedMonth} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-600">Transaction Dashboard © 2024</p>
        </div>
      </footer>
    </div>
  );
}

export default App;