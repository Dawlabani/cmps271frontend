import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import "../../DashboardTheme.css";

const BudgetProgress = ({ budgetUsed, totalBudget }) => {
  const remainingBudget = totalBudget - budgetUsed;
  const budgetPercentage = ((remainingBudget / totalBudget) * 100).toFixed(1);

  const pieData = [
    { name: "Used Budget", value: budgetUsed },
    { name: "Remaining Budget", value: remainingBudget },
  ];

  const COLORS = ["#FF7043", "#66BB6A"]; // Orange for used, Green for remaining

  return (
    <div className="budget-card">
      <h3>Budget Usage</h3>
      <div className="pie-chart-container">
        <PieChart width={280} height={280}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={95}
            dataKey="value"
            label={({ cx, cy }) => (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="1.8rem"
                fontWeight="bold"
                fill="#66BB6A"
              >
                {budgetPercentage}%
              </text>
            )}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </div>
      <p className="remaining-text">Remaining: ${remainingBudget}</p>
    </div>
  );
};

export default BudgetProgress;
