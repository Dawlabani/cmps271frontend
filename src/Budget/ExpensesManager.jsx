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

  // --- filters & pagination state ---
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortFilter, setSortFilter]       = useState('Date');
  const [sortOrder, setSortOrder]         = useState('Descending');
  const [searchText, setSearchText]       = useState('');
  const [page, setPage]                   = useState(1);
  const perPage = 10;

  // --- load on mount ---
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

  const updateList = newList => {
    setExpenses(newList);
    onExpensesChange?.(newList);
  };

  // --- ADD ---
  const handleAdd = async form => {
    try {
      const { data: created } = await apiAddExpense(form);
      updateList([created, ...expenses]);
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
      updateList(expenses.map(e => e.id === saved.id ? saved : e));
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
      updateList(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    } finally {
      setIsRemoving(false);
      setRemovingExpense(null);
    }
  };

  // --- filter / sort / paginate ---
  const filtered = expenses
    .filter(e =>
      (categoryFilter === 'All' || (e.category?.name || 'Undefined') === categoryFilter)
      && e.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortFilter === 'Date') cmp = new Date(a.date) - new Date(b.date);
      if (sortFilter === 'Name') cmp = a.name.localeCompare(b.name);
      if (sortFilter === 'Cost') cmp = a.cost - b.cost;
      if (sortFilter === 'Category') cmp = (a.category?.name || '').localeCompare(b.category?.name || '');
      return sortOrder === 'Ascending' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData   = filtered.slice((page - 1) * perPage, page * perPage);

  // --- handlers for filters & search ---
  const handleSortChange     = e => { setSortFilter(e.target.value); setPage(1); };
  const handleOrderChange    = e => { setSortOrder(e.target.value); setPage(1); };
  const handleCategoryChange = e => { setCategoryFilter(e.target.value); setPage(1); };
  const handleSearchChange   = e => { setSearchText(e.target.value); setPage(1); };

  if (loading) {
    return <div className="expenses-manager"><p>Loading expenses…</p></div>;
  }

  return (
    <motion.section
      className="expenses-manager"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filters */}
      <div className="filters">
        <div className="sort">
          <label>Sort by:</label>
          <select value={sortFilter} onChange={handleSortChange}>
            <option>Date</option><option>Name</option>
            <option>Cost</option><option>Category</option>
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
            <option>Debts & Loans</option>
            <option>Savings & Investments</option>
            <option>Shopping & Lifestyle</option>
            <option>Food & Dining</option>
            <option>Health & Wellness</option>
            <option>Travel & Leisure</option>
            <option>Education & Self-Development</option>
            <option>Giving & Charity</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="Search">
        <input
          type="text"
          placeholder="Search expenses"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Date</th><th>Name</th><th>Cost</th><th>Category</th><th>Actions</th>
            </tr>
          </thead>
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

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {totalPages === 0 ? 0 : page} of {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
          Next
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAdding && <AddExpense onAdd={handleAdd} onCancel={() => setIsAdding(false)} />}
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
