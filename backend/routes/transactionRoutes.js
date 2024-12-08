const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Initialize Database
router.get('/initialize', async (req, res) => {
  try {
    const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = await response.json();
    
    await Transaction.deleteMany({}); // Clear existing data
    await Transaction.insertMany(transactions);
    
    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Transactions with Search and Pagination
router.get('/transactions', async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const monthIndex = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1;

    let query = {
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] }
    };

    if (search) {
      const searchNumber = !isNaN(search) ? Number(search) : null;
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      if (searchNumber !== null) {
        query.$or.push({ price: searchNumber });
      }
    }

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(perPage));

    res.json({
      transactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(perPage)),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Statistics
router.get('/statistics', async (req, res) => {
  try {
    const { month } = req.query;
    const monthIndex = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1;

    const stats = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] }
        }
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: '$price' },
          totalSoldItems: { 
            $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] }
          },
          totalNotSoldItems: { 
            $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      totalSaleAmount: 0,
      totalSoldItems: 0,
      totalNotSoldItems: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const monthIndex = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1;

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Number.MAX_SAFE_INTEGER }
    ];

    const result = await Promise.all(
      priceRanges.map(async ({ min, max }) => {
        const count = await Transaction.countDocuments({
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] },
          price: { $gte: min, $lt: max }
        });
        return {
          range: `${min}-${max === Number.MAX_SAFE_INTEGER ? 'above' : max}`,
          count
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pie Chart Data
router.get('/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const monthIndex = new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1;

    const result = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;