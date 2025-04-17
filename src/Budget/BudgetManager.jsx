// src/Budget/BudgetManager.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './BudgetManager.css';

const categories = [
  'Debts & Loans',
  'Savings & Investments',
  'Shopping & Lifestyle',
  'Food & Dining',
  'Health & Wellness',
  'Travel & Leisure',
  'Education & Self-Development',
  'Giving & Charity',
  'Other'
];

export default function BudgetManager({ initialLimits = {}, onBudgetChange }) {
  const [limits, setLimits] = useState({});

  useEffect(() => {
    const defaults = categories.reduce((acc, cat) => ({
      ...acc,
      [cat]: initialLimits[cat] ?? ''
    }), {});
    setLimits(defaults);
  }, [initialLimits]);

  const handleChange = (cat, value) => {
    const updated = { ...limits, [cat]: value };
    setLimits(updated);
    onBudgetChange?.(updated);
  };

  return (
    <motion.section className="budget-manager"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="bm-title">Budget Manager</h2>
      <p className="bm-subtitle">Set your monthly budget limits for each category.</p>
      <div className="bm-inputs">
        {categories.map(cat => (
          <div key={cat} className="bm-item">
            <label htmlFor={`budget-${cat}`} className="bm-label">{cat}</label>
            <input
              id={`budget-${cat}`}
              type="number"
              className="bm-input"
              value={limits[cat]}
              onChange={e => handleChange(cat, e.target.value)}
              placeholder="Enter limit"
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
