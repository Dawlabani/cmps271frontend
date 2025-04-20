// src/components/ExpensesManager.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddExpense from './AddExpense';
import EditExpense from './EditExpense';
import RemoveExpense from './RemoveExpense';
import {
  getExpenses,
  addExpense as apiAddExpense,
  updateExpense as apiUpdateExpense,
  deleteExpense as apiDeleteExpense
} from '../services/api';
import './ExpensesManager.css';

export default function ExpensesManager({ onExpensesChange }) {
  // Data & loading state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI/dialog state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToRemove, setExpenseToRemove] = useState(null);

  // Filters & pagination
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [searchedExpense, setSearched] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Error & success feedback
  const [error, setError] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Fetch on mount
  useEffect(() => {
    setLoading(true);
    getExpenses()
      .then(({ data }) => {
        setExpenses(data);
        onExpensesChange?.(data);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load expenses.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Helpers: sort, search, filter
  const sortExpenses = (arr, criteria, order) => {
    const sorted = [...arr];
    const cmp = {
      Date: (a, b) => new Date(a.date) - new Date(b.date),
      Name: (a, b) => a.name.localeCompare(b.name),
      Cost: (a, b) => a.cost - b.cost,
      Category: (a, b) =>
        (a.category?.name || '').localeCompare(b.category?.name || '')
    }[criteria];

    if (cmp) sorted.sort(cmp);
    if (order === 'Descending') sorted.reverse();
    return sorted;
  };

  const searched = searchedExpense
    ? expenses.filter(e =>
        e.name.toLowerCase().includes(searchedExpense.toLowerCase())
      )
    : expenses;

  const filtered =
    categoryFilter === 'All'
      ? searched
      : searched.filter(
          e => (e.category?.name || 'Undefined') === categoryFilter
        );

  const sortedList = sortExpenses(filtered, sortFilter, sortOrder);
  const totalPages = sortedList.length
    ? Math.ceil(sortedList.length / itemsPerPage)
    : 0;
  const currentExpenses = sortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAddExpense = () => {
    setError(null);
    setIsAdding(true);
  };

  const handleAddSave = async formData => {
    setError(null);

    const payload = {
      ...formData,
      category:
        typeof formData.category === 'object'
          ? formData.category.name
          : formData.category
    };

    try {
      const { data: newExpense } = await apiAddExpense(payload);
      const updated = [...expenses, newExpense];
      setExpenses(updated);
      onExpensesChange?.(updated);
      setEarnedPoints(Math.round(newExpense.sustainabilityScore || 0));
      setShowCongrats(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to add expense.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditExpense = id => {
    setError(null);
    const found = expenses.find(e => e.id === id);
    setExpenseToEdit(found);
    setIsEditing(true);
  };

  const handleEditSave = async updated => {
    setError(null);
    try {
      const { data } = await apiUpdateExpense(updated.id, updated);
      const updatedList = expenses.map(e => (e.id === data.id ? data : e));
      setExpenses(updatedList);
      onExpensesChange?.(updatedList);
    } catch (err) {
      console.error(err);
      setError('Failed to update expense.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleRemoveExpense = id => {
    setError(null);
    const found = expenses.find(e => e.id === id);
    setExpenseToRemove(found);
    setIsRemoving(true);
  };

  const handleRemoveSave = async id => {
    setError(null);
    try {
      await apiDeleteExpense(id);
      const next = expenses.filter(e => e.id !== id);
      setExpenses(next);
      onExpensesChange?.(next);
    } catch (err) {
      console.error(err);
      setError('Failed to remove expense.');
    } finally {
      setIsRemoving(false);
    }
  };

  // Pagination & filters UI handlers
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(prev => prev - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const handleSearchChange = e => {
    setSearched(e.target.value);
    setCurrentPage(1);
  };
  const handleSortChange = e => {
    setSortFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleOrderChange = e => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };
  const handleCategoryChange = e => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <motion.section
        className="expenses-manager"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p>Loading data…</p>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="expenses-manager"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Error Message */}
      {error && <div className="error">{error}</div>}

      {/* Filters */}
      <div className="filters">
        <div className="sort">
          <label htmlFor="sort-filter">Sort by:</label>
          <select
            id="sort-filter"
            value={sortFilter}
            onChange={handleSortChange}
          >
            <option value="Date">Date</option>
            <option value="Name">Name</option>
            <option value="Cost">Cost</option>
            <option value="Category">Category</option>
          </select>
        </div>
        <div className="sortOrder">
          <label htmlFor="sortOrder-filter">Order:</label>
          <select
            id="sortOrder-filter"
            value={sortOrder}
            onChange={handleOrderChange}
          >
            <option value="Descending">Descending</option>
            <option value="Ascending">Ascending</option>
          </select>
        </div>
        <div className="category">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="All">All</option>
            <option value="Debts & Loans">Debts & Loans</option>
            <option value="Savings & Investments">
              Savings & Investments
            </option>
            <option value="Shopping & Lifestyle">
              Shopping & Lifestyle
            </option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Travel & Leisure">Travel & Leisure</option>
            <option value="Education & Self-Development">
              Education & Self-Development
            </option>
            <option value="Giving & Charity">Giving & Charity</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="search">
        <input
          type="text"
          placeholder="Search expenses"
          value={searchedExpense}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Cost ($)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.length > 0 ? (
              currentExpenses.map(exp => (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td>{exp.name}</td>
                  <td>{exp.cost}</td>
                  <td>{exp.category?.name || 'Undefined'}</td>
                  <td className="row-actions">
                    <button onClick={() => handleEditExpense(exp.id)}>
                      Edit
                    </button>
                    <button onClick={() => handleRemoveExpense(exp.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-expenses">
                  No expenses to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Expense Button */}
      <div className="add-expense">
        <button onClick={handleAddExpense}>New</button>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {totalPages === 0
            ? 'Page 0 of 0'
            : `Page ${currentPage} of ${totalPages}`}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAdding && (
          <AddExpense
            onAdd={handleAddSave}
            onCancel={() => setIsAdding(false)}
          />
        )}
        {isEditing && expenseToEdit && (
          <EditExpense
            initialData={expenseToEdit}
            onSave={handleEditSave}
            onCancel={() => setIsEditing(false)}
          />
        )}
        {isRemoving && expenseToRemove && (
          <RemoveExpense
            onRemove={() => handleRemoveSave(expenseToRemove.id)}
            onCancel={() => setIsRemoving(false)}
          />
        )}

        {showCongrats && (
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
              <h2>🎉 Congratulations!</h2>
              <p>
                You earned <strong>{earnedPoints}</strong> eco‑points.
              </p>
              <button
                onClick={() => setShowCongrats(false)}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
