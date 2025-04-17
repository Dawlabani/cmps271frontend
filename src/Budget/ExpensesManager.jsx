// src/components/ExpensesManager.jsx
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ExpensesManager.css';
import AddExpense from './AddExpense';
import EditExpense from './EditExpense';
import RemoveExpense from './RemoveExpense';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/api';
import { ExpensesContext } from '../contexts/ExpensesContext';

function ExpensesManager({ onExpensesChange }) {
  const { expenses, setExpenses } = useContext(ExpensesContext);

  // Filtering and sorting states
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchedExpense, setSearched] = useState('');

  // Modal states
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [expenseToRemove, setExpenseToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response.data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };
    fetchExpenses();
  }, [setExpenses]);

  const sortExpenses = (expensesArray, criteria, order) => {
    const sorted = [...expensesArray];
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
    if (order === 'Descending') {
      sorted.reverse();
    }
    return sorted;
  };

  // Add Expense Handlers
  const handleAddExpense = () => {
    setIsAdding(true);
  };

  const handleAddSave = (newExpense) => {
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    if (onExpensesChange) onExpensesChange(updatedExpenses);
    setIsAdding(false);
  };

  const handleAddCancel = () => {
    setIsAdding(false);
  };

  // Remove Expense Handlers
  const handleRemoveExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id);
    setExpenseToRemove(expense);
    setIsRemoving(true);
  };

  const handleRemoveSave = async (id) => {
    try {
      await deleteExpense(id);
      const updated = expenses.filter(exp => exp.id !== id);
      setExpenses(updated);
      if (onExpensesChange) onExpensesChange(updated);
      setIsRemoving(false);
    } catch (err) {
      console.error('Error removing expense:', err);
    }
  };

  const handleRemoveCancel = () => {
    setIsRemoving(false);
  };

  // Edit Expense Handlers
  const handleEditExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id);
    setExpenseToEdit(expense);
    setIsEditing(true);
  };

  const handleEditSave = async (updatedExpense) => {
    try {
      const response = await updateExpense(updatedExpense.id, updatedExpense);
      const updatedRecord = response.data;
      const updatedExpenses = expenses.map(exp =>
        exp.id === updatedExpense.id ? updatedRecord : exp
      );
      setExpenses(updatedExpenses);
      if (onExpensesChange) onExpensesChange(updatedExpenses);
      setIsEditing(false);
      setExpenseToEdit(null);
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setExpenseToEdit(null);
  };

  // Sorting & Filtering Handlers
  const handleSortChange = (e) => {
    setSortFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const searchedExpenses =
    searchedExpense === ''
      ? expenses
      : expenses.filter(exp =>
          exp.name.toLowerCase().includes(searchedExpense.toLowerCase())
        );

  const filteredExpenses =
    categoryFilter === 'All'
      ? searchedExpenses
      : searchedExpenses.filter(exp => (exp.category?.name || 'Undefined') === categoryFilter);

  const sortedExpenses = sortExpenses(filteredExpenses, sortFilter, sortOrder);
  const totalPages = sortedExpenses.length === 0 ? 0 : Math.ceil(sortedExpenses.length / itemsPerPage);
  const currentExpenses = sortedExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e) => {
    setSearched(e.target.value);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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
          <select id="sortOrder-filter" value={sortOrder} onChange={handleSortOrderChange}>
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
            <tr className="table-header-row">
              <th>Date</th>
              <th>Name</th>
              <th>Cost ($)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.map((expense) => (
              <tr key={expense.id} className="expense-row">
                <td>{expense.date}</td>
                <td>{expense.name}</td>
                <td>{expense.cost}</td>
                <td>{expense.category?.name || 'Undefined'}</td>
                <td className="row-actions">
                  <button className="edit-btn" onClick={() => handleEditExpense(expense.id)}>
                    Edit
                  </button>
                  <button className="remove-btn" onClick={() => handleRemoveExpense(expense.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentExpenses.length === 0 && (
          <div className="no-expenses">No expenses to display</div>
        )}
      </div>

      {/* Add Expense Button */}
      <div className="add-expense">
        <button className="add-btn" onClick={handleAddExpense}>New</button>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{totalPages === 0 ? 'Page 0 of 0' : `Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {/* Modals for Add/Edit/Remove */}
      <AnimatePresence>
        {isEditing && (
          <EditExpense
            initialData={expenseToEdit}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}
        {isAdding && (
          <AddExpense
            onAdd={handleAddSave}
            onCancel={handleAddCancel}
          />
        )}
        {isRemoving && (
          <RemoveExpense
            onRemove={() => handleRemoveSave(expenseToRemove.id)}
            onCancel={handleRemoveCancel}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default ExpensesManager;
