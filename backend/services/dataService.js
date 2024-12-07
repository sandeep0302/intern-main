const axios = require('axios');
const Transaction = require('../models/Transaction');

const THIRD_PARTY_API = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

const initializeDatabase = async () => {
  try {
    // Check if data already exists
    const existingCount = await Transaction.countDocuments();
    if (existingCount > 0) {
      console.log('Database already initialized');
      return;
    }

    // Fetch data from third party API
    const response = await axios.get(THIRD_PARTY_API);
    const data = response.data;

    // Transform and insert data
    const transactions = data.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      sold: item.sold,
      dateOfSale: new Date(item.dateOfSale),
      image: item.image
    }));

    // Insert into database
    await Transaction.insertMany(transactions);
    console.log('Database initialized successfully with', transactions.length, 'records');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };