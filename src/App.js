import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExpenseProvider } from './context/ExpenseContext';
import WalletBalance from './components/WalletBalance';
import AddExpenseModal from './components/AddExpenseModal';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseTrends from './components/ExpenseTrends';

function App() {
  const [editExpense, setEditExpense] = useState(null);

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
  };

  return (
    <ExpenseProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200"
      >
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Expense Tracker
            </h1>
            <p className="text-gray-600 text-lg">
              Track your income and expenses with beautiful analytics
            </p>
          </motion.div>

          {/* Wallet Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <WalletBalance />
          </motion.div>

          {/* Expenses Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="card">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
                  Expenses
                </h2>
                <AddExpenseModal editExpense={editExpense} setEditExpense={setEditExpense} />
              </div>
              <ExpenseList onEditExpense={handleEditExpense} />
            </div>
          </motion.div>

          {/* Analytics Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="card">
              <ExpenseSummary />
            </div>
            <div className="card">
              <ExpenseTrends />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </ExpenseProvider>
  );
}

export default App; 