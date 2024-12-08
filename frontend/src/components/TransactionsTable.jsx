import React, { useState, useEffect } from 'react';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, currentPage, searchText]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/transactions?month=${selectedMonth}&search=${searchText}&page=${currentPage}&perPage=10`
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
      {/* Title with Selected Month */}
      <h2 className="text-xl font-bold mb-6">
        Transaction Details - {selectedMonth}{' '}
        <span className="text-sm font-normal text-gray-500">
          (Selected Month)
        </span>
      </h2>

      {/* Search Box */}
      <div className="mb-6">
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
      </div>

      {/* Table */}
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
                  <td className="p-3 border-r border-yellow-200">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.sold 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.sold ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center">
                    {renderImage(transaction.image)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>Page No: {currentPage}</div>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className={`text-blue-600 hover:text-blue-800 ${
              currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          <span>-</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages || loading}
            className={`text-blue-600 hover:text-blue-800 ${
              currentPage >= totalPages || loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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