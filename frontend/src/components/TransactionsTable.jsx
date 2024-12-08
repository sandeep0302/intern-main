import React, { useState, useEffect } from 'react';

const TransactionsTable = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('March');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch data when search, month, or page changes
  useEffect(() => {
    fetchTransactions();
  }, [debouncedSearch, selectedMonth, currentPage]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/transactions?month=${selectedMonth}&search=${debouncedSearch}&page=${currentPage}&perPage=10`
      );
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchText('');
    setCurrentPage(1);
  };

  const renderImage = (imageUrl) => {
    if (!imageUrl) return 'No Image';
    
    return (
      <img 
        src={imageUrl} 
        alt="Product"
        className="w-12 h-12 object-cover rounded"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/api/placeholder/48/48';
        }}
      />
    );
  };

  return (
    <div className="bg-blue-50 p-8 rounded-lg">
      <div className="flex justify-between mb-6">
        {/* Search Box with Clear Button */}
        <div className="relative bg-yellow-200 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search by title, description or price..."
            value={searchText}
            onChange={handleSearch}
            className="bg-transparent outline-none w-full placeholder-gray-600"
          />
          {searchText && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-yellow-400 rounded-full px-4 py-2 appearance-none pr-8 outline-none cursor-pointer"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-yellow-100 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-yellow-200">
              <th className="p-3 text-left border-b border-r border-yellow-300">ID</th>
              <th className="p-3 text-left border-b border-r border-yellow-300">Title</th>
              <th className="p-3 text-left border-b border-r border-yellow-300">Description</th>
              <th className="p-3 text-left border-b border-r border-yellow-300">Price</th>
              <th className="p-3 text-left border-b border-r border-yellow-300">Category</th>
              <th className="p-3 text-left border-b border-r border-yellow-300">Sold</th>
              <th className="p-3 text-left border-b border-yellow-300">Image</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-4">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">No transactions found</td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-yellow-200">
                  <td className="p-3 border-r border-yellow-200">{transaction.id}</td>
                  <td className="p-3 border-r border-yellow-200">{transaction.title}</td>
                  <td className="p-3 border-r border-yellow-200">{transaction.description}</td>
                  <td className="p-3 border-r border-yellow-200">${transaction.price}</td>
                  <td className="p-3 border-r border-yellow-200">{transaction.category}</td>
                  <td className="p-3 border-r border-yellow-200">{transaction.sold ? 'Yes' : 'No'}</td>
                  <td className="p-3 flex justify-center">
                    {renderImage(transaction.image)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div>Page No: {currentPage}</div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="text-blue-600 hover:text-blue-800"
          >
            Previous
          </button>
          <span>-</span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
            className="text-blue-600 hover:text-blue-800"
          >
            Next
          </button>
        </div>
        <div>Per Page: 10</div>
      </div>
    </div>
  );
};

export default TransactionsTable;