import React, { useState, useEffect } from 'react';

const TransactionsTable = ({ selectedMonth, onMonthChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchText, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/transactions?month=${selectedMonth}&search=${searchText}&page=${currentPage}&perPage=10`
      );
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search transaction"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="border p-2 rounded"
        >
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-left">Price</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-left">Sold</th>
              <th className="border p-2 text-left">Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="border p-2">{transaction.id}</td>
                <td className="border p-2">{transaction.title}</td>
                <td className="border p-2">{transaction.description}</td>
                <td className="border p-2">${transaction.price}</td>
                <td className="border p-2">{transaction.category}</td>
                <td className="border p-2">{transaction.sold ? 'Yes' : 'No'}</td>
                <td className="border p-2">
                  {new Date(transaction.dateOfSale).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;