// src/components/CategoryBreakdownChart.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { getExpenses } from '../services/api';
import './CategoryBreakdownChart.css';

const COLORS = [
  '#00b894', '#2d3436', '#e74c3c',
  '#f39c12', '#3498db', '#FF5733', '#9b59b6'
];

export default function CategoryBreakdownChart() {
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
        className="category-breakdown-chart"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>Loading data…</p>
      </motion.div>
    );
  }

  const categoryDataMap = expenses.reduce((acc, exp) => {
    const cat = exp.category?.name || 'Undefined';
    acc[cat] = (acc[cat] || 0) + parseFloat(exp.cost || 0);
    return acc;
  }, {});

  const categoryData = Object.entries(categoryDataMap).map(
    ([category, value]) => ({ category, value })
  );

  return (
    <motion.div
      className="category-breakdown-chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label
          >
            {categoryData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
