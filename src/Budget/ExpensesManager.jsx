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
  const [showCongrats, setShowCongrats] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedExpense, setSearched] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToRemove, setExpenseToRemove] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    getExpenses()
      .then(({ data }) => {
        setExpenses(data);
        onExpensesChange?.(data);
      })
      .catch(err => console.error('Error fetching expenses:', err))
      .finally(() => setLoading(false));
  }, []);

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

  const handleAddExpense = () => setIsAdding(true);
  const handleAddSave = async (formData) => {
    // show the “Adding…” UI
    setIsAdding(true);
  
    // build your API payload
    const payload = {
      ...formData,
      category:
        typeof formData.category === 'object'
          ? formData.category.name
          : formData.category,
    };
  
    try {
      // call the backend
      const { data: newExpense } = await apiAddExpense(payload);
  
      // append locally and notify parent exactly once
      setExpenses((prev) => {
        const updated = [...prev, newExpense];
        onExpensesChange?.(updated);
        return updated;
      });
  
      // show eco‑points
      setEarnedPoints(Math.round(newExpense.sustainabilityScore || 0));
      setShowCongrats(true);
    } catch (error) {
      console.error('Error adding expense:', error);
      // you could set an error state here if you want to render a message
    } finally {
      // hide the “Adding…” UI
      setIsAdding(false);
    }
  };
  
  const handleEditExpense = id => {
    setExpenseToEdit(expenses.find(e => e.id === id));
    setIsEditing(true);
  };
  const handleEditSave = async updated => {
    try {
      const { data } = await apiUpdateExpense(updated.id, updated);
      setExpenses(expenses.map(e => e.id === data.id ? data : e));
      onExpensesChange?.(expenses.map(e => e.id === data.id ? data : e));
    } catch (err) {
      console.error('Error updating expense:', err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleRemoveExpense = id => {
    setExpenseToRemove(expenses.find(e => e.id === id));
    setIsRemoving(true);
  };
  const handleRemoveSave = async id => {
    try {
      await apiDeleteExpense(id);
      const next = expenses.filter(e => e.id !== id);
      setExpenses(next);
      onExpensesChange?.(next);
    } catch (err) {
      console.error('Error removing expense:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const handleNextPage     = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
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
      {/* Filters */}
      <div className="filters">
        <div className="sort">
          <label htmlFor="sort-filter">Sort by:</label>
          <select id="sort-filter" value={sortFilter} onChange={handleSortChange}>
            <option value="Date">Date</option>
            <option value="Name">Name</option>
            <option value="Cost">Cost</option>
            <option value="Category">Category</option>
          </select>
        </div>
        <div className="sortOrder">
          <label htmlFor="sortOrder-filter">Sort order:</label>
          <select id="sortOrder-filter" value={sortOrder} onChange={handleOrderChange}>
            <option value="Descending">Descending</option>
            <option value="Ascending">Ascending</option>
          </select>
        </div>
        <div className="category">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select id="category-filter" value={categoryFilter} onChange={handleCategoryChange}>
            <option value="All">All</option>
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
        </div>
      </div>

      {/* Search */}
      <div className="Search">
        <input
          className="searchedExpense"
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
            {currentExpenses.map(exp => (
              <tr key={exp.id}>
                <td>{exp.date}</td>
                <td>{exp.name}</td>
                <td>{exp.cost}</td>
                <td>{exp.category?.name || 'Undefined'}</td>
                <td className="row-actions">
                  <button className="edit-btn" onClick={() => handleEditExpense(exp.id)}>Edit</button>
                  <button className="remove-btn" onClick={() => handleRemoveExpense(exp.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentExpenses.length === 0 && <div className="no-expenses">No expenses to display</div>}
      </div>

      {/* Add button */}
      <div className="add-expense">
        <button className="add-btn" onClick={handleAddExpense}>New</button>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>{totalPages === 0 ? 'Page 0 of 0' : `Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

      <AnimatePresence>
        {isAdding && <AddExpense onAdd={handleAddSave} onCancel={() => setIsAdding(false)} />}
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
