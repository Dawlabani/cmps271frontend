import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../DashboardTheme.css";
import { ExpensesContext } from '../../contexts/ExpensesContext';

const Charts = () => {
  const { expenses } = useContext(ExpensesContext);

  // Aggregate spending by month (using short month names)
  const spendingByMonth = expenses.reduce((acc, expense) => {
    const dateObj = new Date(expense.date);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const cost = parseFloat(expense.cost) || 0;
    if (acc[month]) {
      acc[month] += cost;
    } else {
      acc[month] = cost;
    }
    return acc;
  }, {});

  const spendingData = Object.keys(spendingByMonth).map((month) => ({
    month,
    amount: spendingByMonth[month],
  }));

  // Aggregate spending by category for the pie chart
  const categoryDataMap = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const cost = parseFloat(expense.cost) || 0;
    if (acc[category]) {
      acc[category] += cost;
    } else {
      acc[category] = cost;
    }
    return acc;
  }, {});

  const categoryData = Object.keys(categoryDataMap).map((category) => ({
    name: category,
    value: categoryDataMap[category],
    color: "#" + ((1 << 24) * Math.random() | 0).toString(16)
  }));

  return (
    <div className="charts-container">
      {/* Spending Trends */}
      <div className="chart-card">
        <h3>Spending Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={spendingData}>
            <XAxis dataKey="month" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FFEB3B"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Breakdown */}
      <div className="chart-card">
        <h3>Spending Breakdown</h3>
        <PieChart width={250} height={250}>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default Charts;
