// src/components/RemoveExpense.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './RemoveExpense.css';

function RemoveExpense({ onRemove, onCancel }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h2>Remove Expense</h2>
        <p>Are you sure you want to remove this expense?</p>
        <div className="actions">
          <button
            className="delete-btn"
            type="button"
            onClick={onRemove}
          >
            Delete
          </button>
          <button
            className="cancel-btn"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RemoveExpense;
