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
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Filtering & sorting state
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedExpense, setSearched] = useState('');

  // Modal state
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToRemove, setExpenseToRemove] = useState(null);

  const itemsPerPage = 10;

  // initial fetch
  useEffect(() => {
    setLoading(true);
    getExpenses()
      .then(({ data }) => {
        setExpenses(data);
        onExpensesChange?.(data);
      })
      .catch(err => console.error('Error fetching expenses:', err))
      .finally(() => setLoading(false));
  }, [onExpensesChange]);

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

  // sorting helper
  const sortExpenses = (arr, criteria, order) => {
    const sorted = [...arr];
    switch (criteria) {
      case 'Date':
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'Name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Cost':
        sorted.sort((a, b) => a.cost - b.cost);
        break;
      case 'Category':
        sorted.sort((a, b) =>
          (a.category?.name || '').localeCompare(b.category?.name || '')
        );
        break;
      default:
        break;
    }
    if (order === 'Descending') sorted.reverse();
    return sorted;
  };

  // filter/search/paginate
  const searched = !searchedExpense
    ? expenses
    : expenses.filter(e =>
        e.name.toLowerCase().includes(searchedExpense.toLowerCase())
      );

  const filtered = categoryFilter === 'All'
    ? searched
    : searched.filter(e => (e.category?.name || 'Undefined') === categoryFilter);

  const sortedList = sortExpenses(filtered, sortFilter, sortOrder);
  const totalPages = sortedList.length ? Math.ceil(sortedList.length / itemsPerPage) : 0;
  const currentExpenses = sortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add
  const handleAddExpense = () => {
    setError(null);
    setIsAdding(true);
  };
  const handleAddSave = async form => {
    setError(null);
    try {
      // ensure category is a string
      const payload = {
        ...form,
        category: typeof form.category === 'object' ? form.category.name : form.category
      };
      const { data } = await apiAddExpense(payload);
      setExpenses(prev => {
        const next = [...prev, data];
        onExpensesChange?.(next);
        return next;
      });
      setEarnedPoints(Math.round(data.sustainabilityScore || 0));
      setShowCongrats(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense.');
      console.error('Error adding expense:', err);
    } finally {
      setIsAdding(false);
    }
  };

  // Edit
  const handleEditExpense = id => {
    setExpenseToEdit(expenses.find(e => e.id === id));
    setIsEditing(true);
  };
  const handleEditSave = async updated => {
    try {
      const { data } = await apiUpdateExpense(updated.id, updated);
      setExpenses(prev => {
        const next = prev.map(e => e.id === data.id ? data : e);
        onExpensesChange?.(next);
        return next;
      });
    } catch (err) {
      console.error('Error updating expense:', err);
    } finally {
      setIsEditing(false);
    }
  };

  // Remove
  const handleRemoveExpense = id => {
    setExpenseToRemove(expenses.find(e => e.id === id));
    setIsRemoving(true);
  };
  const handleRemoveSave = async id => {
    try {
      await apiDeleteExpense(id);
      setExpenses(prev => {
        const next = prev.filter(e => e.id !== id);
        onExpensesChange?.(next);
        return next;
      });
    } catch (err) {
      console.error('Error removing expense:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  // pagination & filters
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(p => p - 1);
  const handleNextPage     = () => currentPage < totalPages && setCurrentPage(p => p + 1);
  const handleSearchChange = e => setSearched(e.target.value);
  const handleSortChange   = e => { setSortFilter(e.target.value); setCurrentPage(1); };
  const handleOrderChange  = e => { setSortOrder(e.target.value); setCurrentPage(1); };
  const handleCategoryChange = e => { setCategoryFilter(e.target.value); setCurrentPage(1); };

  return (
    <motion.section
      className="expenses-manager"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {error && <p className="error-text">{error}</p>}

      {/* filters */}
      <div className="filters">
        <div className="sort">
          <label>Sort by:</label>
          <select value={sortFilter} onChange={handleSortChange}>
            <option>Date</option><option>Name</option><option>Cost</option><option>Category</option>
          </select>
        </div>
        <div className="sortOrder">
          <label>Order:</label>
          <select value={sortOrder} onChange={handleOrderChange}>
            <option>Descending</option><option>Ascending</option>
          </select>
        </div>
        <div className="category">
          <label>Category:</label>
          <select value={categoryFilter} onChange={handleCategoryChange}>
            <option>All</option>
            <option>Debts & Loans</option><option>Savings & Investments</option>
            <option>Shopping & Lifestyle</option><option>Food & Dining</option>
            <option>Health & Wellness</option><option>Travel & Leisure</option>
            <option>Education & Self-Development</option><option>Giving & Charity</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {/* search */}
      <div className="Search">
        <input
          type="text"
          placeholder="Search expenses"
          value={searchedExpense}
          onChange={handleSearchChange}
        />
      </div>

      {/* table */}
      <div className="table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Date</th><th>Name</th><th>Cost ($)</th><th>Category</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.map(exp => (
              <tr key={exp.id}>
                <td>{exp.date}</td>
                <td>{exp.name}</td>
                <td>{exp.cost}</td>
                <td>{exp.category?.name || 'Undefined'}</td>
                <td className="row-actions">
                  <button onClick={() => handleEditExpense(exp.id)}>Edit</button>
                  <button onClick={() => handleRemoveExpense(exp.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!currentExpenses.length && <div className="no-expenses">No expenses to display</div>}
      </div>

      {/* new */}
      <div className="add-expense">
        <button onClick={handleAddExpense}>New</button>
      </div>

      {/* pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>
          {totalPages === 0
            ? 'Page 0 of 0'
            : `Page ${currentPage} of ${totalPages}`}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <AddExpense onAdd={handleAddSave} onCancel={() => setIsAdding(false)} />
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
              <p>You earned <strong>{earnedPoints}</strong> eco‑points.</p>
              <button
                className="add-btn"
                onClick={() => {
                  setShowCongrats(false);
                  window.location.reload();
                }}
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
