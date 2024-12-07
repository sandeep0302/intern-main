const Transaction = require('../models/Transaction');
const { initializeDatabase } = require('../services/dataService');

// Initialize Database API
exports.initializeDatabase = async (req, res) => {
  try {
    const result = await initializeDatabase();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List Transactions API
exports.getTransactions = async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const monthIndex = new Date(`${month} 1`).getMonth() + 1;

    let query = {
      $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: isNaN(search) ? undefined : Number(search) }
      ].filter(Boolean);
    }

    const skip = (page - 1) * perPage;
    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(Number(perPage));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      currentPage: Number(page),
      totalPages: Math.ceil(total / perPage),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Statistics API
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1`).getMonth() + 1;

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
      },
      {
        $project: {
          _id: 0,
          totalSaleAmount: 1,
          totalSoldItems: 1,
          totalNotSoldItems: 1
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
};

// Bar Chart API
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1`).getMonth() + 1;

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
      { min: 901, max: Infinity }
    ];

    const counts = await Promise.all(priceRanges.map(async ({ min, max }) => {
      const count = await Transaction.countDocuments({
        $expr: { $eq: [{ $month: '$dateOfSale' }, monthIndex] },
        price: { $gte: min, ...(max !== Infinity && { $lte: max }) }
      });
      
      return {
        range: `${min}-${max === Infinity ? 'above' : max}`,
        count
      };
    }));

    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pie Chart API
exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthIndex = new Date(`${month} 1`).getMonth() + 1;

    const categories = await Transaction.aggregate([
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

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Combined API
exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;
    const [statistics, barChart, pieChart] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: '$dateOfSale' }, new Date(`${month} 1`).getMonth() + 1] }
          }
        },
        {
          $group: {
            _id: null,
            totalSaleAmount: { $sum: '$price' },
            totalSoldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } },
            totalNotSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } }
          }
        }
      ]),
      this.getBarChartData({ query: { month } }),
      this.getPieChartData({ query: { month } })
    ]);

    res.json({
      statistics: statistics[0] || {
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0
      },
      barChart,
      pieChart
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};