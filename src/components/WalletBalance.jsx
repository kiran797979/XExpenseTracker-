import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useExpense } from '../context/ExpenseContext';

const WalletBalance = () => {
  const { balance, addBalance } = useExpense();
  const [incomeAmount, setIncomeAmount] = useState('');

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (incomeAmount && parseFloat(incomeAmount) > 0) {
      addBalance(parseFloat(incomeAmount));
      setIncomeAmount('');
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="text-center">
        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-4"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Wallet Balance
        </motion.h2>
        
        <motion.div 
          className="text-4xl md:text-5xl font-bold text-success-600 mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          ${balance.toFixed(2)}
        </motion.div>
        
        <motion.form 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          onSubmit={handleAddIncome}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="number"
            placeholder="Income Amount"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            min="0"
            step="0.01"
            className="input-field flex-1 max-w-xs"
            required
          />
          <motion.button
            type="submit"
            className="btn-success"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Balance
          </motion.button>
        </motion.form>
        
        <motion.button 
          type="button"
          className="btn-primary mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          + Add Income
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WalletBalance; 