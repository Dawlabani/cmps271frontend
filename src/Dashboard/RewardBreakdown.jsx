// src/Dashboard/RewardBreakdown.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getExpenses } from '../services/api';
import './RewardBreakdown.css';

export default function RewardBreakdown() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpenses()
      .then(({ data }) => setExpenses(data))
      .catch(err => console.error('Error fetching expenses:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <motion.section
        className="reward-breakdown"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>Loading data…</p>
      </motion.section>
    );
  }

  const getEcoPoints = exp => {
    const score = parseFloat(exp.sustainabilityScore);
    return isNaN(score) ? 0 : Math.round(score);
  };

  const recent = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const totalPoints = expenses.reduce((sum, e) => sum + getEcoPoints(e), 0);

  return (
    <motion.section
      className="reward-breakdown"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="reward-subtitle">
        You have a total of <strong>{totalPoints}</strong> eco‑points.
      </p>
      <h1 className="events-list-title">Recent Eco Points Earned</h1>
      <ul className="events-list">
        {recent.length > 0 ? (
          recent.map(exp => (
            <li key={exp.id} className="event-item">
              <span className="event-description">{exp.name}</span>
              <span className="event-points">+{getEcoPoints(exp)} pts</span>
              <span className="event-date">{exp.date}</span>
            </li>
          ))
        ) : (
          <li className="event-item">No recent expenses.</li>
        )}
      </ul>
      <button
        className="redeem-button"
        onClick={() => (window.location.href = '/rewards')}
      >
        Redeem Rewards
      </button>
    </motion.section>
  );
}
