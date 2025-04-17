// src/Dashboard/SpendingChart.jsx
import React, { useContext } from 'react';
import { ExpensesContext } from '../contexts/ExpensesContext';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function SpendingChart() {
  const contextValue = useContext(ExpensesContext);
  console.log('ExpensesContext in SpendingChart:', contextValue);

  if (!contextValue) {
    return <div>Error: ExpensesContext is undefined!</div>;
  }
  const { expenses } = contextValue;
  
  const aggregatedData = expenses.reduce((acc, expense) => {
    const date = expense.date;
    const cost = parseFloat(expense.cost) || 0;
    acc[date] = (acc[date] || 0) + cost;
    return acc;
  }, {});

  const spendingData = Object.keys(aggregatedData)
    .map((date) => ({ date, spending: aggregatedData[date] }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <motion.div
      className="spending-chart"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={spendingData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#2d3436' }}
            label={{ value: 'Date', position: 'insideBottomRight', offset: 0, fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#2d3436' }}
            label={{ value: 'Spending ($)', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="spending"
            stroke="#00b894"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default SpendingChart;
