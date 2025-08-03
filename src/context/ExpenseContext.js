import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  balance: 0,
  expenses: [],
  isLoading: true,
};

// Action types
const ACTIONS = {
  SET_BALANCE: 'SET_BALANCE',
  ADD_BALANCE: 'ADD_BALANCE',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  LOAD_DATA: 'LOAD_DATA',
  SET_LOADING: 'SET_LOADING',
};

// Reducer function
const expenseReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_BALANCE:
      return { ...state, balance: action.payload };
    
    case ACTIONS.ADD_BALANCE:
      return { ...state, balance: state.balance + action.payload };
    
    case ACTIONS.ADD_EXPENSE:
      return { 
        ...state, 
        expenses: [...state.expenses, { ...action.payload, id: Date.now().toString() }],
        balance: state.balance - parseFloat(action.payload.price)
      };
    
    case ACTIONS.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    
    case ACTIONS.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    
    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        balance: action.payload.balance || 0,
        expenses: action.payload.expenses || [],
        isLoading: false,
      };
    
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
};

// Create context
const ExpenseContext = createContext();

// Custom hook for using the context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

// Provider component
export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedExpenses = localStorage.getItem('expenses');
        const savedBalance = localStorage.getItem('balance');
        
        const expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
        const balance = savedBalance ? parseFloat(savedBalance) : 0;
        
        dispatch({ type: ACTIONS.LOAD_DATA, payload: { expenses, balance } });
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('expenses', JSON.stringify(state.expenses));
      localStorage.setItem('balance', state.balance.toString());
    }
  }, [state.expenses, state.balance, state.isLoading]);

  // Action creators
  const addBalance = (amount) => {
    dispatch({ type: ACTIONS.ADD_BALANCE, payload: parseFloat(amount) });
  };

  const addExpense = (expense) => {
    dispatch({ type: ACTIONS.ADD_EXPENSE, payload: expense });
  };

  const updateExpense = (expense) => {
    dispatch({ type: ACTIONS.UPDATE_EXPENSE, payload: expense });
  };

  const deleteExpense = (expenseId) => {
    dispatch({ type: ACTIONS.DELETE_EXPENSE, payload: expenseId });
  };

  const setBalance = (amount) => {
    dispatch({ type: ACTIONS.SET_BALANCE, payload: parseFloat(amount) });
  };

  const value = {
    ...state,
    addBalance,
    addExpense,
    updateExpense,
    deleteExpense,
    setBalance,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}; 