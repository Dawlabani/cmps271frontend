// src/components/RecentTransactions.jsx
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import './RecentTransactions.css';
import { ExpensesContext } from '../contexts/ExpensesContext';

function RecentTransactions() {
  const { expenses } = useContext(ExpensesContext);

  return (
    <motion.section
      className="recent-transactions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.table className="transactions-table">
        <thead>
          <tr className="transactions-row header-row">
            <th className="transaction-cell">Date</th>
            <th className="transaction-cell">Transaction</th>
            <th className="transaction-cell">Amount ($)</th>
            <th className="transaction-cell">Category</th>
          </tr>
        </thead>
        <motion.tbody>
          {expenses.map((transaction) => (
            <motion.tr
              key={transaction.id}
              className="transactions-row"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <td className="transaction-cell">{transaction.date}</td>
              <td className="transaction-cell">{transaction.name}</td>
              <td className="transaction-cell">{transaction.cost}</td>
              <td className="transaction-cell">
                {transaction.category ? transaction.category.name : 'Undefined'}
              </td>
            </motion.tr>
          ))}
          {expenses.length === 0 && (
            <tr className="transactions-row">
              <td colSpan="4" className="transaction-cell">
                <div className="no-transaction">No recent transaction</div>
              </td>
            </tr>
          )}
        </motion.tbody>
      </motion.table>
    </motion.section>
  );
}

export default RecentTransactions;
