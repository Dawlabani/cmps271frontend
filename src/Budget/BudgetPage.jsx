// src/Budget/BudgetPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BudgetManager from './BudgetManager';
import ExpensesManager from './ExpensesManager';
import { getBudgets, updateBudgets } from '../services/api';
import './BudgetPage.css';

function BudgetPage() {
  const [budgetLimits, setBudgetLimits] = useState({});
  const [loadingBudget, setLoadingBudget] = useState(true);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    getBudgets(month, year)
      .then(({ data }) => {
        const limits = data.reduce((acc, { category, limit }) => {
          acc[category] = limit;
          return acc;
        }, {});
        setBudgetLimits(limits);
      })
      .catch(err => console.error('Error fetching budget:', err))
      .finally(() => setLoadingBudget(false));
  }, [month, year]);

  const handleBudgetChange = updatedLimits => setBudgetLimits(updatedLimits);

  const saveBudgets = () => {
    const budgetsArray = Object.entries(budgetLimits).map(([category, limit]) => ({
      category,
      limit: Number(limit) || 0,
    }));

    updateBudgets({ month, year, budgets: budgetsArray })
      .then(({ data }) => console.log('Budget updated:', data))
      .catch(err => console.error('Error updating budget:', err));
  };

  return (
    <div className="budget-page">
      <motion.main
        className="budget-page-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <header className="budget-page-header">
          <h1>Budget Overview</h1>
          <p>Manage your limits and review expenses for better financial control.</p>
        </header>

        <section className="manager-section">
          {loadingBudget ? (
            <p>Loading budget…</p>
          ) : (
            <BudgetManager
              onBudgetChange={handleBudgetChange}
              initialLimits={budgetLimits}
            />
          )}
          <button className="save-btn" onClick={saveBudgets}>
            Save
          </button>
        </section>

        <section className="expenses-section">
          <h2>Expenses</h2>
          <ExpensesManager />
        </section>
      </motion.main>
    </div>
  );
}

export default BudgetPage;
