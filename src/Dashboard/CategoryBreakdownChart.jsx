// src/components/CategoryBreakdownChart.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExpensesContext } from '../contexts/ExpensesContext';

function CategoryBreakdownChart() {
  const { expenses } = useContext(ExpensesContext);

  const categoryDataMap = expenses.reduce((acc, expense) => {
    const catName = expense.category?.name || 'Undefined';
    const cost = parseFloat(expense.cost) || 0;
    acc[catName] = (acc[catName] || 0) + cost;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryDataMap).map((key) => ({
    category: key,
    value: categoryDataMap[key],
  }));

  const COLORS = ['#00b894', '#2d3436', '#e74c3c', '#f39c12', '#3498db', '#FF5733', '#9b59b6'];

  return (
    <motion.div
      className="category-breakdown-chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
            fill="#8884d8"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default CategoryBreakdownChart;
