import React from 'react';
import './BudgetSummary.css';

export default function BudgetSummary({ budgets, expenses }) {
  // Total budget
  const totalBudget = Object.values(budgets)
    .reduce((sum, val) => sum + Number(val || 0), 0);

  // Total spent across all expenses
  const totalSpent = expenses
    .reduce((sum, exp) => sum + parseFloat(exp.cost || 0), 0);

  const remaining = totalBudget - totalSpent;

  return (
    <div className="budget-summary">
      <div className="card">
        <h3>Total Budget</h3>
        <p>${totalBudget.toFixed(2)}</p>
      </div>
      <div className="card">
        <h3>Total Spent</h3>
        <p>${totalSpent.toFixed(2)}</p>
      </div>
      <div className={`card ${remaining < 0 ? 'overspent' : ''}`}>
        <h3>Remaining</h3>
        <p>${remaining.toFixed(2)}</p>
      </div>
    </div>
  );
}
