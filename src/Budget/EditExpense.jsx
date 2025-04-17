// src/components/EditExpense.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './EditExpense.css';

function EditExpense({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: initialData.id,
    date: initialData.date,
    name: initialData.name,
    cost: initialData.cost,
    category: initialData.category,
    details: initialData.details || {
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

  // Handle top-level changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'category') {
        // Reset details if user changes category
        return {
          ...prev,
          [name]: value,
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

  // Handle boolean/string changes in details
  const handleDetailChange = (detailKey, val) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [detailKey]: val,
      },
    }));
  };

  // Ensure user answers all required detail questions for the chosen category
  const isDetailsComplete = () => {
    const categoryQuestions = {
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
    const required = categoryQuestions[formData.category] || [];
    return required.every((key) => formData.details[key] !== null);
  };

  // When user clicks "Save"
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
        <h2>Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </label>
          <label>
            Name:
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Cost:
            <input
              name="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
            />
          </label>
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Debts & Loans">Debts & Loans</option>
              <option value="Savings & Investments">Savings & Investments</option>
              <option value="Shopping & Lifestyle">Shopping & Lifestyle</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Travel & Leisure">Travel & Leisure</option>
              <option value="Education & Self-Development">
                Education & Self-Development
              </option>
              <option value="Giving & Charity">Giving & Charity</option>
              <option value="Other">Other</option>
            </select>
          </label>

          {/* Render the same detail questions as AddExpense for the chosen category */}
          <div className="Details">
            {(() => {
              switch (formData.category) {
                case 'Debts & Loans':
                  return (
                    <>
                      <h2>Details</h2>
                      <p>Is this a green debt?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={
                            formData.details.greenDebt === true ? 'selected' : 'unselected'
                          }
                          onClick={() => handleDetailChange('greenDebt', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={
                            formData.details.greenDebt === false ? 'selected' : 'unselected'
                          }
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
                      <h2>Details</h2>
                      <p>Is this a green investment?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={
                            formData.details.greenInvestment === true ? 'selected' : 'unselected'
                          }
                          onClick={() => handleDetailChange('greenInvestment', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={
                            formData.details.greenInvestment === false
                              ? 'selected'
                              : 'unselected'
                          }
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
                      <h2>Details</h2>
                      <p>Is this from a sustainable brand?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={
                            formData.details.sustainableBrand === true
                              ? 'selected'
                              : 'unselected'
                          }
                          onClick={() => handleDetailChange('sustainableBrand', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={
                            formData.details.sustainableBrand === false
                              ? 'selected'
                              : 'unselected'
                          }
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
                      <h2>Details</h2>
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
                          className={
                            formData.details.organic === false ? 'selected' : 'unselected'
                          }
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
                      <h2>Details</h2>
                      <p>Are natural products used?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={
                            formData.details.naturalProducts === true ? 'selected' : 'unselected'
                          }
                          onClick={() => handleDetailChange('naturalProducts', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={
                            formData.details.naturalProducts === false ? 'selected' : 'unselected'
                          }
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
                      <h2>Details</h2>
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
                          className={
                            formData.details.mode === 'carpool' ? 'selected' : 'unselected'
                          }
                          onClick={() => handleDetailChange('mode', 'carpool')}
                        >
                          Carpool
                        </button>
                        <button
                          type="button"
                          className={
                            formData.details.mode === 'electric' ? 'selected' : 'unselected'
                          }
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
                      <h2>Details</h2>
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
                      <h2>Details</h2>
                      <p>Is this a green charity?</p>
                      <div className="question-buttons">
                        <button
                          type="button"
                          className={
                            formData.details.greenCharity === true ? 'selected' : 'unselected'
                          }
                          onClick={() => handleDetailChange('greenCharity', true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={
                            formData.details.greenCharity === false ? 'selected' : 'unselected'
                          }
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
                      <h2>Details</h2>
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
              className="save-btn"
              type="submit"
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
              Save
            </button>
            <button className="cancel-btn" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EditExpense;
