// src/components/AddExpense.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AddExpense.css';
import { addExpense } from '../services/api';

function AddExpense({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    cost: '',
    category: 'Other',
    details: {
      greenDebt: null,
      greenInvestment: null,
      sustainableBrand: null,
      organic: null,
      local: null,
      naturalProducts: null,
      mode: null,
      online: null,
      greenCharity: null,
    },
  });
  const [error, setError] = useState(null);

  // Handle top-level fields (date, name, cost, category)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'category') {
        // Reset details to null when category changes
        return {
          ...prev,
          category: value,
          details: {
            greenDebt: null,
            greenInvestment: null,
            sustainableBrand: null,
            organic: null,
            local: null,
            naturalProducts: null,
            mode: null,
            online: null,
            greenCharity: null,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // Handle category-specific boolean or string values
  const handleDetailChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: val,
      },
    }));
  };

  // Ensure all required detail fields are answered for the selected category.
  const isDetailsComplete = () => {
    const requiredByCategory = {
      'Debts & Loans': ['greenDebt'],
      'Savings & Investments': ['greenInvestment'],
      'Shopping & Lifestyle': ['sustainableBrand'],
      'Food & Dining': ['organic', 'local'],
      'Health & Wellness': ['naturalProducts'],
      'Travel & Leisure': ['mode'],
      'Education & Self-Development': ['online'],
      'Giving & Charity': ['greenCharity'],
      'Other': [],
    };
    const requiredFields = requiredByCategory[formData.category] || [];
    return requiredFields.every(field => formData.details[field] !== null);
  };

  // Submit the form to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate fields
    if (!formData.date || !formData.name || !formData.cost || !formData.category) {
      setError('Please fill out all required fields.');
      return;
    }
    if (isNaN(Number(formData.cost)) || Number(formData.cost) < 0) {
      setError('Cost must be a positive number.');
      return;
    }
    if (!isDetailsComplete()) {
      setError('Please answer all required questions for this category.');
      return;
    }

    try {
      const response = await addExpense(formData);
      onAdd(response.data);
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err.response?.data?.error || 'Failed to add expense.');
    }
  };

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
        <h2>Add Expense</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Cost:
            <input
              type="number"
              step="0.01"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Debts & Loans">Debts & Loans</option>
              <option value="Savings & Investments">Savings & Investments</option>
              <option value="Shopping & Lifestyle">Shopping & Lifestyle</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Travel & Leisure">Travel & Leisure</option>
              <option value="Education & Self-Development">Education & Self-Development</option>
              <option value="Giving & Charity">Giving & Charity</option>
              <option value="Other">Other</option>
            </select>
          </label>

          {/* Hardcoded detail questions based on selected category */}
          <div className="Details">
            {(() => {
              switch (formData.category) {
                case 'Debts & Loans':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>Is this a green debt?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.greenDebt === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('greenDebt', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.greenDebt === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('greenDebt', false)}
                        >
                          No
                        </button>
                      </div>
                    </>
                  );
                case 'Savings & Investments':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>Is this a green investment?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.greenInvestment === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('greenInvestment', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.greenInvestment === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('greenInvestment', false)}
                        >
                          No
                        </button>
                      </div>
                    </>
                  );
                case 'Shopping & Lifestyle':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>Is this from a sustainable brand?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.sustainableBrand === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('sustainableBrand', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.sustainableBrand === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('sustainableBrand', false)}
                        >
                          No
                        </button>
                      </div>
                    </>
                  );
                case 'Food & Dining':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>Is the food organic?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.organic === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('organic', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.organic === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('organic', false)}
                        >
                          No
                        </button>
                      </div>
                      <p>Is the food locally sourced?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.local === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('local', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.local === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('local', false)}
                        >
                          No
                        </button>
                      </div>
                    </>
                  );
                case 'Health & Wellness':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>Are natural products used?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.naturalProducts === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('naturalProducts', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.naturalProducts === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('naturalProducts', false)}
                        >
                          No
                        </button>
                      </div>
                    </>
                  );
                case 'Travel & Leisure':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>What is your mode of travel?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.mode === 'public' ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('mode', 'public')}
                        >
                          Public
                        </button>
                        <button
                          type="button"
                          className={formData.details.mode === 'carpool' ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('mode', 'carpool')}
                        >
                          Carpool
                        </button>
                        <button
                          type="button"
                          className={formData.details.mode === 'electric' ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('mode', 'electric')}
                        >
                          Electric
                        </button>
                      </div>
                    </>
                  );
                case 'Education & Self-Development':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>Is this an online course?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.online === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('online', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.online === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('online', false)}
                        >
                          No
                        </button>
                      </div>
                    </>
                  );
                case 'Giving & Charity':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>Is this a green charity?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={formData.details.greenCharity === true ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('greenCharity', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={formData.details.greenCharity === false ? 'selected' : 'unselected'}
                          onClick={() => handleDetailChange('greenCharity', false)}
                        >
                          No
                        </button>
                      </div>
                    </>
                  );
                case 'Other':
                  return (
                    <>
                      <h3>Details</h3>
                      <p>No additional details required for this category.</p>
                    </>
                  );
                default:
                  return null;
              }
            })()}
          </div>

          <div className="actions">
            <button
              type="submit"
              className="add-btn"
              disabled={
                !formData.date ||
                !formData.name ||
                !formData.cost ||
                !formData.category ||
                Number(formData.cost) < 0 ||
                isNaN(Number(formData.cost)) ||
                !isDetailsComplete()
              }
            >
              Add
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddExpense;
