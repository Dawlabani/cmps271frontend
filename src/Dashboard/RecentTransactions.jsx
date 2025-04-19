// src/components/RecentTransactions.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getExpenses } from '../services/api';
import './RecentTransactions.css';

export default function RecentTransactions() {
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
        className="recent-transactions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p>Loading data…</p>
      </motion.section>
    );
  }

  const recent = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <motion.section
      className="recent-transactions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction</th>
            <th>Amount ($)</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {recent.length > 0 ? (
            recent.map(tx => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.name}</td>
                <td>{tx.cost}</td>
                <td>{tx.category?.name || 'Undefined'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-transaction">
                No recent transactions
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.section>
  );
}
