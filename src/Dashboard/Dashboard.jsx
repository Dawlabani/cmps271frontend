// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SpendingChart from './SpendingChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import RecentTransactions from './RecentTransactions';
import RewardBreakdown from './RewardBreakdown';
import { getBudgets, getSustainabilityMetrics } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [budget, setBudget] = useState(0);
  const [sustainabilityScore, setSustainabilityScore] = useState(0);
  const [ecoPoints, setEcoPoints] = useState(0);

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    getBudgets(month, year)
      .then(({ data }) => {
        const total = data.reduce((sum, b) => sum + parseFloat(b.limit), 0);
        setBudget(total);
      })
      .catch(console.error);

    getSustainabilityMetrics()
      .then(({ data }) => {
        setSustainabilityScore(data.sustainabilityScore);
        setEcoPoints(data.ecoPoints);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard">
      <motion.main className="dashboard-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <header className="dashboard-header">
          <h1>Budget Dashboard</h1>
          <p>Overview of your financial health, spending trends, and rewards</p>
        </header>
        
        <section className="charts-section">
          <div className="chart-container">
            <h2>Spending Trends</h2>
            <SpendingChart />
          </div>
          <div className="chart-container">
            <h2>Category Breakdown</h2>
            <CategoryBreakdownChart />
          </div>
        </section>

        <section className="transactions-section">
          <h2>Recent Transactions</h2>
          <RecentTransactions />
        </section>

        <section className="rewards-section">
          <h2>Reward Breakdown</h2>
          <RewardBreakdown />
        </section>
      </motion.main>
    </div>
  );
}

export default Dashboard;
