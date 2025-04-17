// components/EditProfileModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './EditProfileModal.css';

function EditProfileModal({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
    location: initialData.location,
    bio: initialData.bio,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
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
            Email:
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Location:
            <input 
              name="location" 
              type="text" 
              value={formData.location} 
              onChange={handleChange} 
            />
          </label>
          <label>
            Bio:
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
            />
          </label>
          <div className="modal-buttons">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EditProfileModal;
