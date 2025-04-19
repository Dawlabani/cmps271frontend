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
  deleteExpense as apiDeleteExpense,
} from '../services/api';
import './ExpensesManager.css';

export default function ExpensesManager({ onExpensesChange }) {
  // --- data state ---
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- modal state ---
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removingExpense, setRemovingExpense] = useState(null);

  // --- pagination / filters (unchanged) ---
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortFilter, setSortFilter]       = useState('Date');
  const [sortOrder, setSortOrder]         = useState('Descending');
  const [searchText, setSearchText]       = useState('');
  const [page, setPage]                   = useState(1);
  const perPage = 10;

  // Fetch on mount
  useEffect(() => {
    async function load() {
      try {
        const { data } = await getExpenses();
        setExpenses(data);
        onExpensesChange?.(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [onExpensesChange]);

  // helper to refresh parent if needed
  const updateParent = newList => {
    setExpenses(newList);
    onExpensesChange?.(newList);
  };

  // --- ADD ---
  const handleAdd = async form => {
    try {
      const { data: created } = await apiAddExpense(form);
      updateParent([created, ...expenses]);
    } catch (err) {
      console.error('Error adding expense:', err);
    } finally {
      setIsAdding(false);
    }
  };

  // --- EDIT ---
  const handleEdit = async updated => {
    try {
      const { data: saved } = await apiUpdateExpense(updated.id, updated);
      updateParent(expenses.map(e => (e.id === saved.id ? saved : e)));
    } catch (err) {
      console.error('Error updating expense:', err);
    } finally {
      setIsEditing(false);
      setEditingExpense(null);
    }
  };

  // --- REMOVE ---
  const handleRemove = async id => {
    try {
      await apiDeleteExpense(id);
      updateParent(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    } finally {
      setIsRemoving(false);
      setRemovingExpense(null);
    }
  };

  // --- filtering, sorting, paging (same logic as before) ---
  const filtered = expenses
    .filter(e =>
      (categoryFilter === 'All' ||
        (e.category?.name || 'Undefined') === categoryFilter) &&
      e.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortFilter === 'Date') {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sortFilter === 'Name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortFilter === 'Cost') {
        cmp = a.cost - b.cost;
      } else if (sortFilter === 'Category') {
        cmp = (a.category?.name || '').localeCompare(b.category?.name || '');
      }
      return sortOrder === 'Ascending' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData   = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return <div className="expenses-manager"><p>Loading expenses…</p></div>;
  }

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
          <thead> {/* … same as before … */} </thead>
          <tbody>
            {pageData.map(exp => (
              <tr key={exp.id}>
                <td>{exp.date}</td>
                <td>{exp.name}</td>
                <td>{exp.cost}</td>
                <td>{exp.category?.name || 'Undefined'}</td>
                <td>
                  <button onClick={() => { setEditingExpense(exp); setIsEditing(true); }}>
                    Edit
                  </button>
                  <button onClick={() => { setRemovingExpense(exp); setIsRemoving(true); }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pageData.length === 0 && <div className="no-expenses">No expenses to display</div>}
      </div>

      {/* Pagination (same as before) */}

      {/* Modals */}
      <AnimatePresence>
        {isAdding && <AddExpense    onAdd={handleAdd}    onCancel={() => setIsAdding(false)} />}
        {isEditing && editingExpense && (
          <EditExpense
            initialData={editingExpense}
            onSave={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        )}
        {isRemoving && removingExpense && (
          <RemoveExpense
            onRemove={() => handleRemove(removingExpense.id)}
            onCancel={() => setIsRemoving(false)}
          />
        )}
      </AnimatePresence>

      {/* Add button */}
      <div className="add-expense">
        <button onClick={() => setIsAdding(true)}>New</button>
      </div>
    </motion.section>
  );
}