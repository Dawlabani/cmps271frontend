// src/Dashboard/RewardBreakdown.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import './RewardBreakdown.css';
import { ExpensesContext } from '../contexts/ExpensesContext';

function RewardBreakdown() {
  const { expenses = [] } = useContext(ExpensesContext);

  const getEcoPointsForExpense = (expense) => {
    const score = parseFloat(expense.sustainabilityScore);
    return isNaN(score) ? 0 : Math.round(score);
  };

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const totalEcoPoints = expenses.reduce(
    (sum, exp) => sum + getEcoPointsForExpense(exp),
    0
  );

  return (
    <motion.section
      className="reward-breakdown"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <p className="reward-subtitle">
        Below are your most recent expenses and their eco points. You have a total of <strong>{totalEcoPoints}</strong> points.
      </p>
      <h1 className='events-list-title'>Recent Eco Points Earned</h1>
      <div className="reward-events">
        <ul className="events-list">
          {recentExpenses.length > 0 ? (
            recentExpenses.map((exp) => {
              const points = getEcoPointsForExpense(exp);
              return (
                <li key={exp.id} className="event-item">
                  <span className="event-description">{exp.name}</span>
                  <span className="event-points">+{points} pts</span>
                  <span className="event-date">{exp.date}</span>
                </li>
              );
            })
          ) : (
            <li className="event-item">No recent expenses.</li>
          )}
        </ul>
      </div>

      <button
        className="redeem-button"
        onClick={() => {
          window.location.href = '/rewards';
        }}
      >
        Redeem Rewards
      </button>
    </motion.section>
  );
}

export default RewardBreakdown;
