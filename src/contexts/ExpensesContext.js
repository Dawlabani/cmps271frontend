import React, { createContext, useState } from 'react';

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Groceries', cost: 120, date: '2025-02-10', category: 'Food & Dining' },
    { id: 2, name: 'Loan Payment', cost: 300, date: '2025-02-11', category: 'Debts & Loans' },
    { id: 3, name: 'Restaurant', cost: 60, date: '2025-02-11', category: 'Food & Dining' },
    { id: 4, name: 'Cinema', cost: 50, date: '2025-02-12', category: 'Travel & Leisure' },
    { id: 5, name: 'Textbooks', cost: 100, date: '2025-02-12', category: 'Education & Self-Development' },
  ]);

  // New state for rewards points
  const [rewardsPoints, setRewardsPoints] = useState(2450);

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        setExpenses,
        rewardsPoints,
        setRewardsPoints,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};
