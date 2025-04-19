// src/Budget/BudgetPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BudgetManager from './BudgetManager';
import ExpensesManager from './ExpensesManager';
import BudgetSummary from './BudgetSummary';
import { getBudgets, updateBudgets, getExpenses } from '../services/api';
import './BudgetPage.css';

function BudgetPage() {
  const [budgetLimits, setBudgetLimits] = useState({});
  const [loadingBudget, setLoadingBudget] = useState(true);

  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Fetch budget limits
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

  // Fetch expenses
  useEffect(() => {
    getExpenses()
      .then(({ data }) => setExpenses(data))
      .catch(err => console.error('Error fetching expenses:', err))
      .finally(() => setLoadingExpenses(false));
  }, []);

  const handleBudgetChange = updatedLimits => {
    setBudgetLimits(updatedLimits);
  };

  const saveBudgets = () => {
    const budgetsArray = Object.entries(budgetLimits).map(([category, limit]) => ({
      category,
      limit: Number(limit) || 0,
    }));

    updateBudgets({ month, year, budgets: budgetsArray })
      .then(({ data }) => console.log('Budget updated:', data))
      .catch(err => console.error('Error updating budget:', err));
  };

  // Compute spending by category for utilization bars
  const spentByCategory = expenses.reduce((acc, exp) => {
    const cat = exp.category?.name || 'Other';
    acc[cat] = (acc[cat] || 0) + parseFloat(exp.cost || 0);
    return acc;
  }, {});

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

        {/* 0) Summary */}
        <section className="summary-section">
          {(!loadingBudget && !loadingExpenses) ? (
            <BudgetSummary budgets={budgetLimits} expenses={expenses} />
          ) : (
            <p>Loading summary…</p>
          )}
        </section>

        {/* 1) Expenses first */}
        <section className="expenses-section">
          <h2>Expenses</h2>
          {loadingExpenses ? <p>Loading expenses…</p> : <ExpensesManager />}
        </section>

        {/* 2) Then your budget manager */}
        <section className="manager-section">
          {loadingBudget ? (
            <p>Loading budget…</p>
          ) : (
            <BudgetManager
              initialLimits={budgetLimits}
              onBudgetChange={handleBudgetChange}
              spentByCategory={spentByCategory}
            />
          )}
          <button className="save-btn" onClick={saveBudgets}>
            Save
          </button>
        </section>
      </motion.main>
    </div>
  );
}

export default BudgetPage;
