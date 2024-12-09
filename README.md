# Product Transactions Dashboard

A MERN stack application for visualizing and managing product transactions data. The application provides various views including statistics, transaction details, and charts to analyze sales data.

## Features

- Monthly transaction data visualization
- Search functionality for transactions
- Statistics overview with total sales and item counts
- Bar chart showing price range distribution
- Transactions table with pagination
- Real-time data filtering and updates
- Responsive design

## Tech Stack

- **Frontend:**
  - React.js with Vite
  - Tailwind CSS for styling
  - Chart.js for data visualization
  
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd intern-main
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory with:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/transactions
```

## Running the Application

1. Start MongoDB service

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```

4. Initialize the database by visiting:
```
http://localhost:5000/api/initialize
```

## API Endpoints

- `GET /api/transactions` - List transactions with search and pagination
- `GET /api/statistics` - Get monthly statistics
- `GET /api/bar-chart` - Get price range distribution data
- `GET /api/initialize` - Initialize database with seed data

## Features Usage

1. **Month Selection:**
   - Select month from the dropdown to filter all data

2. **Transaction Search:**
   - Search by title, description, or price
   - Results update automatically as you type

3. **Pagination:**
   - Navigate through transaction pages
   - 10 items per page

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
