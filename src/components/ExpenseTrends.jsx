import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpense } from '../context/ExpenseContext';

const ExpenseTrends = () => {
  const { expenses } = useExpense();

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Trends</h3>
        <div className="text-gray-500">No expenses to display</div>
      </motion.div>
    );
  }

  // Group expenses by date and calculate daily totals
  const dailyTotals = expenses.reduce((acc, expense) => {
    const date = expense.date;
    acc[date] = (acc[date] || 0) + expense.price;
    return acc;
  }, {});

  // Convert to array and sort by date
  const data = Object.entries(dailyTotals)
    .map(([date, total]) => ({
      date: new Date(date).toLocaleDateString(),
      amount: total
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Daily Expense Trends
      </h3>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{
                color: '#374151',
                fontWeight: '600'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ 
                fill: '#3B82F6', 
                strokeWidth: 2, 
                r: 4,
                stroke: '#ffffff'
              }}
              activeDot={{ 
                r: 6, 
                stroke: '#3B82F6', 
                strokeWidth: 2,
                fill: '#ffffff'
              }}
              animationDuration={1000}
              animationBegin={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-2 gap-4 text-center"
      >
        <div>
          <div className="text-2xl font-bold text-gray-800">
            {data.length}
          </div>
          <div className="text-sm text-gray-500">Days with Expenses</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800">
            ${(data.reduce((sum, day) => sum + day.amount, 0) / data.length).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Average Daily</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseTrends; 