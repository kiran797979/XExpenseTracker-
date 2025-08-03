import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpense } from '../context/ExpenseContext';

const AddExpenseModal = ({ editExpense, setEditExpense }) => {
  const { addExpense, updateExpense } = useExpense();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Food', // default to Food
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editExpense) {
      setFormData({
        title: editExpense.title || '',
        price: editExpense.price || '',
        category: editExpense.category || '',
        date: editExpense.date || ''
      });
      setIsOpen(true);
    } else {
      setFormData({
        title: '',
        price: '',
        category: 'Food', // default to Food
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [editExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.price && formData.category && formData.date) {
      const expenseData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        date: formData.date
      };

      if (editExpense) {
        updateExpense({ ...expenseData, id: editExpense.id });
        setEditExpense(null);
      } else {
        addExpense(expenseData);
      }
      
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditExpense(null);
    setFormData({
      title: '',
      price: '',
      category: 'Food', // default to Food
      date: new Date().toISOString().split('T')[0]
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <motion.button
        type="button"
        className="btn-primary"
        onClick={openModal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        + Add Expense
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="modal-content p-6"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editExpense ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <motion.button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={handleClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter expense title"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <motion.button
                  type="submit"
                  className="btn-success w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editExpense ? 'Update Expense' : 'Add Expense'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddExpenseModal; 