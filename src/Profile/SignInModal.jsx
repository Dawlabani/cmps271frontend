// src/components/SignInModal.jsx
import React, { useState } from 'react';
import './SignInModal.css';

const SignInModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation for required fields
    if (!formData.email || !formData.password) {
      setErrors({ form: "Email and password are required." });
      return;
    }
    onSave(formData);  // Pass data to parent to handle login
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sign-in-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="sign-in-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          {errors.form && <p className="error-text">{errors.form}</p>}
          <button type="submit" className="submit-btn">Sign In</button>
        </form>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SignInModal;
