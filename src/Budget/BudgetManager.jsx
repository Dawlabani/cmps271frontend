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

export default function BudgetManager({
  initialLimits = {},
  spentByCategory = {},
  onBudgetChange
}) {
  const [limits, setLimits] = useState({});

  // initialize limits from props
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
    <motion.section
      className="budget-manager"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="bm-title">Budget Manager</h2>
      <p className="bm-subtitle">Set your monthly budget limits and see utilization.</p>
      <div className="bm-list">
        {categories.map(cat => {
          const limit = Number(limits[cat]) || 0;
          const spent = parseFloat(spentByCategory[cat] || 0);
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          return (
            <div key={cat} className="bm-row">
              <div className="bm-row-header">
                <span className="bm-label">{cat}</span>
                <span className="bm-values">
                  ${spent.toFixed(2)} / ${limit}
                </span>
              </div>
              <div className="bm-bar-container">
                <div className="bm-bar-background">
                  <div
                    className="bm-bar-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
              <input
                id={`budget-${cat}`}
                type="number"
                className="bm-input"
                value={limits[cat]}
                onChange={e => handleChange(cat, e.target.value)}
                placeholder="Enter limit"
              />
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
