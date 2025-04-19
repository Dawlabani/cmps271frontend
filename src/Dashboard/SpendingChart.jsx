// src/Dashboard/SpendingChart.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getExpenses } from '../services/api';

export default function SpendingChart() {
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
      <motion.div
        className="spending-chart"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>Loading data…</p>
      </motion.div>
    );
  }

  const aggregated = expenses.reduce((acc, e) => {
    acc[e.date] = (acc[e.date] || 0) + parseFloat(e.cost || 0);
    return acc;
  }, {});

  const data = Object.entries(aggregated)
    .map(([date, spending]) => ({ date, spending }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <motion.div
      className="spending-chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="spending" stroke="#00b894" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
